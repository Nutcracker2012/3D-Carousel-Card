import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three/webgpu";

const CARD_W = 1.8;
const CARD_H = 2.2;
const CARD_RADIUS = 0.2;
const CAROUSEL_RADIUS = 5;

function createCardShape(w, h, r) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w / 2, h / 2 - r);
  shape.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

function CarouselCard({ url, index, total, currentAngle, onSelect }) {
  const texture = useTexture(url);
  const meshRef = useRef();
  const baseAngle = (index / total) * Math.PI * 2;

  const geometry = useMemo(
    () => new THREE.ShapeGeometry(createCardShape(CARD_W, CARD_H, CARD_RADIUS), 12),
    []
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const a = baseAngle + currentAngle.current;
    meshRef.current.position.x = Math.sin(a) * CAROUSEL_RADIUS;
    meshRef.current.position.z = Math.cos(a) * CAROUSEL_RADIUS;
    meshRef.current.rotation.y = -a;
    // power-4 curve: side cards (60°) → 37% of center, tiny cards (120°) → 8%
    const t = (Math.cos(a) + 1) / 2;
    meshRef.current.scale.setScalar(0.1 + 1.2 * Math.pow(t, 4));
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      <meshBasicNodeMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function ImageCarousel({ images }) {
  const currentAngle = useRef(0);
  const targetAngle = useRef(0);
  const angleStep = (Math.PI * 2) / images.length;

  const handleSelect = (index) => {
    const raw = -index * angleStep;
    let target = raw;
    while (target - currentAngle.current > Math.PI) target -= Math.PI * 2;
    while (target - currentAngle.current < -Math.PI) target += Math.PI * 2;
    targetAngle.current = target;
  };

  useFrame((_, delta) => {
    currentAngle.current +=
      (targetAngle.current - currentAngle.current) * (1 - Math.exp(-delta * 4));
  });

  return (
    <>
      {images.map((url, i) => (
        <CarouselCard
          key={url}
          url={url}
          index={i}
          total={images.length}
          currentAngle={currentAngle}
          onSelect={handleSelect}
        />
      ))}
    </>
  );
}
