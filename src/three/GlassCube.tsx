import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, RoundedBox, Text } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import type * as THREE from 'three';
import './GlassCube.css';

const MOBILE_BREAKPOINT = 768;

const isDebugEnabled = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

const useIsMobile = (breakpoint = MOBILE_BREAKPOINT) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
};

const ISO_ROTATION_X = 0.6;
const ISO_ROTATION_Y = 0.79;

interface RotatingGlassCubeProps {
  color: string;
  rotationSpeed: number;
  resolution: number;
  samples: number;
}

const RotatingGlassCube = ({ color, rotationSpeed, resolution, samples }: RotatingGlassCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useControls('Verre', {
    color,
    distortion: { value: 0, min: 0, max: 0.6, step: 0.01 },
    distortionScale: { value: 0, min: 0, max: 0.8, step: 0.01 },
    chromaticAberration: { value: 0.03, min: 0, max: 0.4, step: 0.005 },
    ior: { value: 1.3, min: 1, max: 2.6, step: 0.05 },
    thickness: { value: 0.3, min: 0, max: 2.5, step: 0.05 },
    temporalDistortion: { value: 0, min: 0, max: 0.3, step: 0.01 },
    roughness: { value: 0, min: 0, max: 0.5, step: 0.01 },
    backsideThickness: { value: 0.3, min: 0, max: 2, step: 0.05 },
    attenuationColor: '#ffffff',
    attenuationDistance: { value: 8, min: 0.1, max: 12, step: 0.1 },
  });

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y += delta * rotationSpeed;
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[2, 2, 2]}
      radius={0.03}
      smoothness={4}
      rotation={[ISO_ROTATION_X, ISO_ROTATION_Y, 0]}
    >
      <MeshTransmissionMaterial
        transmission={1}
        anisotropy={0.1}
        backside
        resolution={resolution}
        samples={samples}
        {...material}
      />
    </RoundedBox>
  );
};

interface GlassCubeProps {
  text?: string;
  color?: string;
  rotationSpeed?: number;
  disableOnMobile?: boolean;
  className?: string;
}

const GlassCube = ({
  text = 'Explore\nNew\nIdeas',
  color = '#ffffff',
  rotationSpeed = 0.25,
  disableOnMobile = false,
  className,
}: GlassCubeProps) => {
  const isMobile = useIsMobile();
  const resolution = isMobile ? 512 : 1024;
  const samples = isMobile ? 6 : 12;

  const wrapperClassName = ['glass-cube-wrapper', className].filter(Boolean).join(' ');
  const plainText = text.replace(/\n/g, ' ');

  if (isMobile && disableOnMobile) {
    return (
      <div className={wrapperClassName}>
        <h1 className="glass-cube-text glass-cube-text--fallback">{plainText}</h1>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Leva hidden={!isDebugEnabled()} />
      <h1 className="glass-cube-sr-only">{plainText}</h1>
      <Canvas
        className="glass-cube-canvas"
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={1.2} />
        <Environment preset="studio" environmentIntensity={1.6} />
        <directionalLight position={[4, 5, 3]} intensity={3.5} />
        <directionalLight position={[0, 6, 1.5]} intensity={3} />
        <directionalLight position={[-4, 2, 4]} intensity={2} />
        <Text
          position={[0, 0, -0.8]}
          fontSize={1.35}
          lineHeight={0.82}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
          toneMapped={false}
        >
          {text}
        </Text>
        <RotatingGlassCube color={color} rotationSpeed={rotationSpeed} resolution={resolution} samples={samples} />
      </Canvas>
    </div>
  );
};

export default GlassCube;
