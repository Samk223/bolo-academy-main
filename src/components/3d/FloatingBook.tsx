import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

function Book() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Book cover */}
        <RoundedBox args={[2.4, 3.2, 0.4]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1a4480" roughness={0.3} metalness={0.1} />
        </RoundedBox>
        
        {/* Book spine */}
        <RoundedBox args={[0.1, 3.2, 0.4]} radius={0.02} smoothness={4} position={[-1.25, 0, 0]}>
          <meshStandardMaterial color="#0d2847" roughness={0.4} metalness={0.1} />
        </RoundedBox>
        
        {/* Pages */}
        <RoundedBox args={[2.2, 3, 0.35]} radius={0.02} smoothness={4} position={[0.05, 0, 0]}>
          <meshStandardMaterial color="#f5f0e6" roughness={0.8} metalness={0} />
        </RoundedBox>

        {/* Gold decoration lines */}
        <mesh position={[0, 1.2, 0.21]}>
          <boxGeometry args={[1.8, 0.05, 0.01]} />
          <meshStandardMaterial color="#c9a227" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -1.2, 0.21]}>
          <boxGeometry args={[1.8, 0.05, 0.01]} />
          <meshStandardMaterial color="#c9a227" roughness={0.2} metalness={0.8} />
        </mesh>
        
        {/* "A" letter on cover */}
        <mesh position={[0, 0.2, 0.22]}>
          <ringGeometry args={[0.3, 0.4, 32]} />
          <meshStandardMaterial color="#c9a227" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#c9a227" transparent opacity={0.6} />
    </points>
  );
}

export default function FloatingBook() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#c9a227" />
        <pointLight position={[0, 0, 4]} intensity={0.5} color="#1a4480" />
        <Book />
        <Particles />
      </Canvas>
    </div>
  );
}
