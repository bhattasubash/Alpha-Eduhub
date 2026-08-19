"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";

function Building({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

function City({ reducedMode = false }: { reducedMode?: boolean }) {
  const buildings = [];
  const buildingCount = reducedMode ? 20 : 50;

  // Generate random buildings
  for (let i = 0; i < buildingCount; i++) {
    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100 - 20;
    const height = Math.random() * 20 + 5;
    const width = Math.random() * 3 + 2;
    const depth = Math.random() * 3 + 2;
    const color = Math.random() > 0.5 ? "#1a1a2e" : "#16213e";

    buildings.push(
      <Building
        key={i}
        position={[x, height / 2, z]}
        scale={[width, height, depth]}
        color={color}
      />
    );
  }

  return <>{buildings}</>;
}

function Moon() {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={[20, 30, -50]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.5, 2, 0.8]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </Float>
  );
}

function WebStrands({ reducedMode = false }: { reducedMode?: boolean }) {
  const strands = [];
  const strandCount = reducedMode ? 5 : 10;

  for (let i = 0; i < strandCount; i++) {
    const startX = (Math.random() - 0.5) * 100;
    const endX = (Math.random() - 0.5) * 100;
    const startY = Math.random() * 50 + 20;
    const endY = Math.random() * 50 + 20;
    const z = (Math.random() - 0.5) * 100 - 50;

    strands.push(
      <line key={i}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([startX, startY, z, endX, endY, z])}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3498db" opacity={0.3} transparent />
      </line>
    );
  }

  return <>{strands}</>;
}

function CharacterPlaceholder() {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={[0, 5, 0]}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1.5, 2, 0.8]} />
          <meshStandardMaterial color="#3498db" />
        </mesh>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
      </group>
    </Float>
  );
}

export default function CityScene() {
  const [reducedMode, setReducedMode] = useState(false);

  useEffect(() => {
    // Detect low-performance devices
    const checkPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      setReducedMode(isMobile || isLowEnd);
    };

    checkPerformance();
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        gl={{
          antialias: !reducedMode,
          alpha: true,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 10, 30], fov: 60 }}
        dpr={reducedMode ? 1 : [1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1} />
          <pointLight position={[30, 40, -50]} intensity={2} color="#f5f5dc" />

          {/* Fog */}
          <fog attach="fog" args={["#050816", 30, 100]} />

          {/* Scene Elements */}
          <Stars
            count={reducedMode ? 500 : 1000}
            radius={100}
            depth={50}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <City reducedMode={reducedMode} />
          <Moon />
          <WebStrands reducedMode={reducedMode} />
          <CharacterPlaceholder />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={reducedMode ? 0.2 : 0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}