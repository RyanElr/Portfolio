"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense } from "react";

function Laptop() {
  return (
    <group position={[0, -0.55, 0]} rotation={[0, -0.22, 0]}>
      <RoundedBox args={[3.5, 0.12, 2.3]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color="#8c939b" metalness={0.9} roughness={0.28} />
      </RoundedBox>
      <RoundedBox args={[3.18, 0.015, 1.12]} position={[0, 0.07, -0.37]} radius={0.025}>
        <meshStandardMaterial color="#171b21" roughness={0.65} />
      </RoundedBox>
      {Array.from({ length: 5 }, (_, row) => Array.from({ length: 13 }, (_, col) => (
        <RoundedBox key={`${row}-${col}`} args={[0.205, 0.025, 0.16]} radius={0.018} position={[(col - 6) * 0.236, 0.09, -0.79 + row * 0.21]}>
          <meshStandardMaterial color="#303640" metalness={0.25} roughness={0.45} />
        </RoundedBox>
      )))}
      <RoundedBox args={[1.12, 0.008, 0.52]} radius={0.04} position={[0, 0.068, 0.65]}>
        <meshStandardMaterial color="#727c87" metalness={0.85} roughness={0.32} />
      </RoundedBox>
      <group position={[0, 0.07, -1.04]} rotation={[-0.18, 0, 0]}>
        <RoundedBox args={[3.5, 2.18, 0.1]} radius={0.07} position={[0, 1.09, 0]} castShadow>
          <meshStandardMaterial color="#78828e" metalness={0.9} roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[3.34, 2.02, 0.015]} radius={0.045} position={[0, 1.09, 0.056]}>
          <meshStandardMaterial color="#080c12" roughness={0.24} />
        </RoundedBox>
        <mesh position={[0, 1.1, 0.067]}>
          <planeGeometry args={[3.12, 1.76]} /><meshBasicMaterial color="#101e2c" />
        </mesh>
        <mesh position={[-1.27, 1.1, 0.072]}>
          <planeGeometry args={[0.48, 1.76]} /><meshBasicMaterial color="#152839" />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[-0.28 + (i % 3) * 0.09, 1.8 - i * 0.125, 0.074]}>
            <planeGeometry args={[0.65 + ((i * 7) % 9) * 0.12, 0.025]} />
            <meshBasicMaterial color={i % 4 === 0 ? "#f6a968" : i % 3 === 0 ? "#83cbbf" : "#8197b1"} />
          </mesh>
        ))}
        <mesh position={[0, 2.105, 0.062]}><sphereGeometry args={[0.018, 12, 12]} /><meshStandardMaterial color="#172538" metalness={0.5} roughness={0.1} /></mesh>
      </group>
    </group>
  );
}

export default function HeroCanvas({ className }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="Ordinateur portable en aluminium dans un studio éclairé, vue 3D interactive">
      <Canvas shadows camera={{ position: [4, 3, 6], fov: 38 }} dpr={[1, 1.5]} fallback={<div className="p-8 text-slate-300">Un atelier numérique, du code aux interfaces.</div>}>
        <color attach="background" args={["#0c111a"]} />
        <ambientLight intensity={0.35} />
        <spotLight position={[2, 6, 4]} intensity={65} angle={0.5} penumbra={1} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}>
          <Environment resolution={128}>
            <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} intensity={3} />
            <Lightformer position={[-4, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} intensity={2} color="#b4d4ff" />
            <Lightformer position={[4, 1, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 4, 1]} intensity={3} color="#ffc18a" />
          </Environment>
          <Laptop />
          <ContactShadows position={[0, -0.63, 0]} opacity={0.65} scale={12} blur={2.5} far={4} resolution={256} frames={1} />
        </Suspense>
        <OrbitControls makeDefault enablePan={false} enableZoom={false} minPolarAngle={0.6} maxPolarAngle={1.45} minAzimuthAngle={-0.8} maxAzimuthAngle={0.8} target={[0, 0.25, 0]} />
      </Canvas>
    </div>
  );
}
