import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";

function GameCube() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    meshRef.current.rotation.y += 0.004;
    meshRef.current.rotation.x += 0.001;
  });

  return (
    <Float speed={3} rotationIntensity={1.2} floatIntensity={2}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2.8, 2.8, 2.8]} />

        {/* neon material */}
        <meshStandardMaterial
  color="#111827"
  metalness={0.9}
  roughness={0.1}
  emissive="#9333ea"
  emissiveIntensity={0.7}
/>
      </mesh>
    </Float>
  );
}

export default function GameHero3D() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">

  {/* TEXT */}
  <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
    <h1 className="text-7xl font-extrabold text-white tracking-widest">
      DISCOVER
    </h1>

    <h1 className="text-7xl font-extrabold text-purple-500 tracking-widest">
      GAMES
    </h1>

    <p className="text-gray-400 mt-6 text-lg">
      Explore top games across every universe
    </p>

    <Link
      to="/games"
      className="mt-6 inline-block px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
    >
      Go To Home
    </Link>
  </div>

  {/* CANVAS */}
  <Canvas style={{ height: "100vh", width: "100%" }} camera={{ position: [5, 2, 7], fov: 60 }}>
    <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 5, 5]} intensity={2} color="#8b5cf6" />
    <pointLight position={[-5, -5, -5]} intensity={2} color="#22c55e" />
    <pointLight position={[0, 5, 0]} intensity={2} color="#3b82f6" />

    <GameCube />

    <OrbitControls enableZoom={false} enablePan={false} />
  </Canvas>

</div>
  );
}
