"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ExtrudeGeometry, Group, MathUtils, Mesh, Shape } from "three";

// Curved, tapered blades form a pierced, bilateral emblem.
function makeBlade() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.45, 0.28, 0.55, 1.35, 1.8, 2.9);
  shape.bezierCurveTo(1.22, 1.62, 1.3, 1.2, 1.08, 0.9);
  shape.bezierCurveTo(1.6, 1.1, 1.75, 1.65, 2.45, 1.9);
  shape.bezierCurveTo(1.9, 1.05, 1.35, 0.42, 0.85, 0.32);
  shape.bezierCurveTo(1.3, 0.2, 1.8, 0.45, 2.12, 0.72);
  shape.bezierCurveTo(1.65, -0.05, 0.78, -0.16, 0, 0);
  const hole = new Shape();
  hole.moveTo(0.68, 0.43);
  hole.bezierCurveTo(0.95, 0.55, 1.18, 0.88, 1.35, 1.25);
  hole.bezierCurveTo(0.94, 1.03, 0.7, 0.74, 0.68, 0.43);
  shape.holes.push(hole);
  const geometry = new ExtrudeGeometry(shape, { depth: 0.065, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.018, bevelThickness: 0.02, curveSegments: 24 });
  // Bake two silhouettes once; the GPU interpolates them during scrolling.
  const targets = [0, 1].map(mode => {
    const target = geometry.clone();
    const positions = target.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const reach = Math.min(1, Math.hypot(x, y) / 3.4);
      const twist = (mode === 0 ? 0.65 : -0.48) * reach * reach;
      positions.setXYZ(i,
        (x * Math.cos(twist) - y * Math.sin(twist)) * (mode === 0 ? 0.72 : 1.15),
        (x * Math.sin(twist) + y * Math.cos(twist)) * (mode === 0 ? 1.12 : 0.7),
        z + Math.sin(reach * Math.PI * 0.8) * reach * (mode === 0 ? 0.8 : -0.65));
    }
    target.computeVertexNormals();
    return target;
  });
  geometry.morphAttributes.position = targets.map(target => target.attributes.position.clone());
  geometry.morphAttributes.normal = targets.map(target => target.attributes.normal.clone());
  targets.forEach(target => target.dispose());
  // Deformed tips can extend outside the original silhouette.
  geometry.boundingSphere = null;
  return geometry;
}

function Blade({ geometry, angle, index, side, progress, reduced }: {
  geometry: ExtrudeGeometry; angle: number; index: number; side: number;
  progress: RefObject<number>; reduced: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    phase.current = reduced ? 0 : MathUtils.damp(phase.current, progress.current, 5 - index * 0.8, delta);
    const p = phase.current;
    const wave = Math.sin(p * Math.PI * 1.3 + index * 0.55 + side * 0.15);
    const rest = Math.sin(index * 0.55 + side * 0.15);
    const fold = (wave - rest) * 0.35;
    mesh.current.rotation.set(fold * side * 0.6, index * 0.13 + fold * 0.8, angle + fold);
    const base = 1 - index * 0.18;
    mesh.current.scale.set(base * (1 + fold * 0.12), base * (1 - fold * 0.16), base);
    if (mesh.current.morphTargetInfluences) {
      const amount = Math.sin(p * Math.PI * 0.85 + index * 0.22) * Math.min(1, p * 3);
      mesh.current.morphTargetInfluences[0] = reduced ? 0 : Math.max(0, amount) * 0.9;
      mesh.current.morphTargetInfluences[1] = reduced ? 0 : Math.max(0, -amount) * 0.85;
    }
  });
  return (
    <mesh ref={mesh} geometry={geometry} onUpdate={node => node.updateMorphTargets()} frustumCulled={false}>
      <meshStandardMaterial color="#fa2516" metalness={0.48} roughness={0.28} />
    </mesh>
  );
}

const poses = [
  { x: 0.28, y: 0, scale: 0.82, rx: -0.12, ry: -0.3, rz: -0.2 },
  { x: 0.34, y: 0.03, scale: 0.66, rx: 0.2, ry: 1.25, rz: 0.3 },
  { x: -0.3, y: -0.03, scale: 0.7, rx: -0.3, ry: 2.7, rz: -0.5 },
  { x: -0.27, y: 0.05, scale: 0.52, rx: 0.15, ry: 3.6, rz: 0.2 },
];

function Emblem({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const ref = useRef<Group>(null);
  const geometry = useMemo(makeBlade, []);
  const smoothedProgress = useRef(0);
  const { viewport } = useThree();
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    smoothedProgress.current = reduced ? 0 : MathUtils.damp(smoothedProgress.current, MathUtils.clamp(progress.current, 0, 3), 6, delta);
    const p = smoothedProgress.current;
    const index = Math.min(2, Math.floor(p));
    const fraction = p - index;
    const t = fraction * fraction * (3 - 2 * fraction);
    const arc = Math.sin(fraction * Math.PI) ** 2;
    const a = poses[index], b = poses[index + 1];
    const mix = (key: keyof typeof a) => MathUtils.lerp(a[key], b[key], t);
    const mobile = viewport.width < 7;
    ref.current.position.x = MathUtils.damp(ref.current.position.x, mix("x") * viewport.width, 7, delta);
    ref.current.position.y = (mix("y") + arc * 0.06 * (index % 2 ? -1 : 1)) * viewport.height;
    ref.current.rotation.set(mix("rx"), mix("ry"), mix("rz") + arc * 0.16);
    const size = Math.min(viewport.height / 6.5, viewport.width / (mobile ? 4.8 : 10)) * mix("scale");
    ref.current.scale.setScalar(size);
  });
  return (
    <group ref={ref}>
      {[-1, 1].map(side => (
        <group key={side} scale={[side, 1, 1]}>
          {[0, -0.68, -1.5].map((angle, i) => (
            <Blade key={angle} geometry={geometry} angle={angle} index={i} side={side} progress={progress} reduced={reduced} />
          ))}
        </group>
      ))}
      <mesh rotation={[0, 0, Math.PI / 4]} scale={[0.2, 0.55, 0.15]}>
        <octahedronGeometry /><meshStandardMaterial color="#ff3921" metalness={0.45} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function ScrollSculpture({ progress }: { progress: RefObject<number> }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-55 md:opacity-90" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} fallback={null}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 4, 5]} intensity={4} color="#fff0e8" />
        <directionalLight position={[-4, -2, 2]} intensity={2} color="#ff3820" />
        <Emblem progress={progress} reduced={reduced} />
      </Canvas>
    </div>
  );
}
