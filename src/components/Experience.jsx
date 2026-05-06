import { Suspense, useEffect, useState } from "react";
import { useControls, folder, button } from "leva";
import { useThree } from "@react-three/fiber";
import { ImageCarousel } from "./ImageCarousel";

const IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=1000&fit=crop",
];

export const Experience = () => {
  const { camera } = useThree();
  const [allCollapsed, setAllCollapsed] = useState(false);

  const controls = useControls(
    () => ({
      "↕  Collapse / Expand All": button(() =>
        setAllCollapsed((c) => !c)
      ),
      Camera: folder(
        {
          cameraZ: { value: 10,  min: 3,   max: 30,  step: 0.5 },
          cameraY: { value: 0,   min: -10, max: 10,  step: 0.5 },
          fov:     { value: 70,  min: 20,  max: 120, step: 1   },
        },
        { collapsed: allCollapsed }
      ),
      Carousel: folder(
        {
          radius: { value: 5,   min: 2,   max: 15,  step: 0.5 },
          tiltX:  { value: -13, min: -90, max: 90,  step: 1   },
        },
        { collapsed: allCollapsed }
      ),
      "Card Size": folder(
        {
          imageWidth:   { value: 1.5,  min: 0.5, max: 5,   step: 0.1  },
          imageHeight:  { value: 2.5,  min: 0.5, max: 6,   step: 0.1  },
          cornerRadius: { value: 0.1,  min: 0,   max: 0.5, step: 0.01 },
          bendAmount:   { value: 0.1,  min: 0,   max: 1,   step: 0.05 },
        },
        { collapsed: allCollapsed }
      ),
      "Card Visuals": folder(
        {
          centerOpacity:    { value: 1.0, min: 0,   max: 1.0, step: 0.05 },
          adjacentOpacity:  { value: 0.9, min: 0,   max: 1.0, step: 0.05 },
          farOpacity:       { value: 0.6, min: 0,   max: 1.0, step: 0.05 },
          centerSaturation: { value: 1.0, min: 0,   max: 2.0, step: 0.05 },
          farSaturation:    { value: 0.5, min: 0,   max: 2.0, step: 0.05 },
          brightness:       { value: 1.0, min: 0.1, max: 2.0, step: 0.05 },
        },
        { collapsed: allCollapsed }
      ),
      Physics: folder(
        {
          friction:         { value: 95,  min: 80, max: 99,   step: 1  },
          wheelSensitivity: { value: 100, min: 1,  max: 500,  step: 5  },
          dragSensitivity:  { value: 300, min: 1,  max: 1000, step: 10 },
          enableSnapping:   true,
        },
        { collapsed: allCollapsed }
      ),
    }),
    [allCollapsed]
  );

  useEffect(() => {
    camera.position.set(0, controls.cameraY, controls.cameraZ);
    camera.fov = controls.fov;
    camera.updateProjectionMatrix();
  }, [controls.cameraZ, controls.cameraY, controls.fov]);

  return (
    <Suspense fallback={null}>
      <ImageCarousel
        images={IMAGES}
        radius={controls.radius}
        tiltX={controls.tiltX}
        imageWidth={controls.imageWidth}
        imageHeight={controls.imageHeight}
        cornerRadius={controls.cornerRadius}
        bendAmount={controls.bendAmount}
        centerOpacity={controls.centerOpacity}
        adjacentOpacity={controls.adjacentOpacity}
        farOpacity={controls.farOpacity}
        centerSaturation={controls.centerSaturation}
        farSaturation={controls.farSaturation}
        brightness={controls.brightness}
        friction={controls.friction / 100}
        wheelSensitivity={controls.wheelSensitivity}
        dragSensitivity={controls.dragSensitivity}
        enableSnapping={controls.enableSnapping}
      />
    </Suspense>
  );
};
