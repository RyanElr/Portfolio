 "use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Suspense, useMemo } from "react";

type HeroCanvasProps = {
  className?: string;
};

function Particles() {
  const positions = useMemo(() => {
    const pts = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const r = 4 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;
      pts[i * 3] = Math.cos(angle) * r;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pts;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        color="#f97316"
        transparent
        opacity={0.9}
      />
    </points>
  );
}

function HeroObject() {
  return (
    <Float
      speed={1.4}
      rotationIntensity={1}
      floatIntensity={1.4}
      floatingRange={[-0.4, 0.4]}
    >
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1.1, 0.34, 220, 32]} />
        <meshStandardMaterial
          color="#f97316"
          metalness={0.7}
          roughness={0.25}
          emissive="#ea580c"
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas({ className }: HeroCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        shadows
        dpr={[1, 2]}
      >
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.7}
          castShadow
          color="#f97316"
        />
        <spotLight
          position={[-6, 4, -4]}
          intensity={1.2}
          angle={0.6}
          penumbra={0.9}
          color="#4f46e5"
        />

        <Suspense fallback={null}>
          <HeroObject />
          <Particles />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.1}
        />
      </Canvas>
    </div>
  );
}

