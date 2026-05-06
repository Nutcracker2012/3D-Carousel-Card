import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import {
  abs,
  add,
  div,
  length,
  max,
  mix,
  mul,
  positionLocal,
  saturation,
  smoothstep,
  sub,
  texture,
  uniform,
  uv,
  vec3,
  vec4,
} from "three/tsl";
import { NodeMaterial } from "three/webgpu";

function ImagePlane({
  tex,
  index,
  total,
  currentIndex,
  radius,
  imageWidth,
  imageHeight,
  widthSegments,
  heightSegments,
  cornerRadius,
  bendAmount,
  centerOpacity,
  adjacentOpacity,
  farOpacity,
  centerSaturation,
  farSaturation,
  brightness,
}) {
  const meshRef = useRef();
  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // TSL uniforms — mutate .value each render, no material rebuild needed
  const satUniform   = useRef(uniform(1.0));
  const brightUniform = useRef(uniform(1.0));

  // Compute distance from front card
  let dist = Math.abs(index - currentIndex);
  if (dist > total / 2) dist = total - dist;

  const opacity = dist === 0 ? centerOpacity : dist === 1 ? adjacentOpacity : farOpacity;
  const t = dist === 0 ? 1 : dist === 1 ? 0.5 : 0;
  satUniform.current.value    = THREE.MathUtils.lerp(farSaturation, centerSaturation, t);
  brightUniform.current.value = brightness;

  useFrame(() => {
    if (meshRef.current)
      meshRef.current.lookAt(0, meshRef.current.position.y, 0);
  });

  const material = useMemo(() => {
    const mat = new NodeMaterial();

    // Bend card surface to follow cylinder curvature
    const normalizedX = div(positionLocal.x, imageWidth * 0.5);
    const curvature = mul(mul(normalizedX, normalizedX), mul(bendAmount, 2.0));
    mat.positionNode = vec3(
      positionLocal.x,
      positionLocal.y,
      add(positionLocal.z, curvature)
    );

    // Texture + saturation + brightness + rounded-corner SDF mask
    const uvCoords   = uv();
    const imageColor = texture(tex, uvCoords);
    const adjusted   = saturation(mul(imageColor, brightUniform.current), satUniform.current);
    const center     = sub(uvCoords, 0.5);
    const d          = length(max(sub(abs(center), 0.5 - cornerRadius), 0.0));
    const mask       = smoothstep(add(cornerRadius, 0.01), sub(cornerRadius, 0.01), d);
    mat.colorNode    = mix(vec4(0, 0, 0, 0), adjusted, mask);

    mat.transparent = true;
    mat.side = THREE.DoubleSide;

    return mat;
  }, [tex, cornerRadius, bendAmount, imageWidth]);

  material.opacity = opacity;

  return (
    <mesh ref={meshRef} position={[x, 0, z]} material={material}>
      <planeGeometry args={[imageWidth, imageHeight, widthSegments, heightSegments]} />
    </mesh>
  );
}

export function ImageCarousel({
  images = [],
  radius = 5,
  tiltX = -13,
  scale = 1.0,
  scaleY = 1.0,
  imageWidth = 1.5,
  imageHeight = 2.5,
  cornerRadius = 0.1,
  bendAmount = 0.1,
  widthSegments = 32,
  heightSegments = 32,
  centerOpacity = 1.0,
  adjacentOpacity = 0.9,
  farOpacity = 0.6,
  centerSaturation = 1.0,
  farSaturation = 0.5,
  brightness = 1.0,
  friction = 0.95,
  wheelSensitivity = 100,
  dragSensitivity = 300,
  enableSnapping = true,
}) {
  const groupRef = useRef();
  const { gl } = useThree();
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const targetRotationRef = useRef(0);
  const isSnapping = useRef(false);

  const textures = useTexture(images);

  useEffect(() => {
    const canvas = gl.domElement;

    const onWheel = (e) => {
      e.preventDefault();
      velocityRef.current += e.deltaY * wheelSensitivity * 0.0000001;
      isSnapping.current = false;
    };
    const onMouseDown = (e) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      canvas.style.cursor = "grabbing";
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      velocityRef.current +=
        (e.clientX - lastMouseX.current) * dragSensitivity * 0.0000001;
      lastMouseX.current = e.clientX;
      isSnapping.current = false;
    };
    const onMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };
    const onTouchStart = (e) => {
      isDragging.current = true;
      lastMouseX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      velocityRef.current +=
        (e.touches[0].clientX - lastMouseX.current) *
        dragSensitivity *
        0.0000001;
      lastMouseX.current = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      isDragging.current = false;
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [gl.domElement, wheelSensitivity, dragSensitivity]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Friction
    velocityRef.current *= Math.pow(friction, delta * 60);

    // Snap to nearest card when nearly stopped
    if (
      enableSnapping &&
      !isDragging.current &&
      !isSnapping.current &&
      Math.abs(velocityRef.current) < 0.0002
    ) {
      const step = (Math.PI * 2) / images.length;
      const normalized =
        ((-rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const nearest = Math.round(normalized / step) % images.length;
      let target = -(nearest * step);

      const d1 = Math.abs(target - rotationRef.current);
      const d2 = Math.abs(target + Math.PI * 2 - rotationRef.current);
      const d3 = Math.abs(target - Math.PI * 2 - rotationRef.current);
      if (d2 < d1 && d2 < d3) target += Math.PI * 2;
      else if (d3 < d1 && d3 < d2) target -= Math.PI * 2;

      targetRotationRef.current = target;
      isSnapping.current = true;
      velocityRef.current = 0;
    }

    if (isSnapping.current) {
      const diff = targetRotationRef.current - rotationRef.current;
      if (Math.abs(diff) < 0.005) {
        rotationRef.current = targetRotationRef.current;
        isSnapping.current = false;
      } else {
        rotationRef.current += diff * 0.15;
      }
    } else {
      rotationRef.current += velocityRef.current * delta * 60;
    }

    groupRef.current.rotation.y = rotationRef.current;

    // Track which card is in front
    const step = (Math.PI * 2) / images.length;
    const normalized =
      ((-rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const newIndex = Math.round(normalized / step) % images.length;
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  });

  if (!images.length) return null;

  return (
    <group ref={groupRef} rotation-x={THREE.MathUtils.degToRad(tiltX)} scale={[scale, scale * scaleY, scale]}>
      {images.map((img, i) => (
        <ImagePlane
          key={`${img}-${i}`}
          tex={textures[i]}
          index={i}
          total={images.length}
          currentIndex={currentIndex}
          radius={radius}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          widthSegments={widthSegments}
          heightSegments={heightSegments}
          cornerRadius={cornerRadius}
          bendAmount={bendAmount}
          centerOpacity={centerOpacity}
          adjacentOpacity={adjacentOpacity}
          farOpacity={farOpacity}
          centerSaturation={centerSaturation}
          farSaturation={farSaturation}
          brightness={brightness}
        />
      ))}
    </group>
  );
}
