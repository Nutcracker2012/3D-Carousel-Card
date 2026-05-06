import { Suspense, useEffect } from "react";
import { useControls, folder } from "leva";
import { useThree } from "@react-three/fiber";
import { ImageCarousel } from "./ImageCarousel";

const IMAGES = [
  "https://picsum.photos/seed/carousel1/800/1000",
  "https://picsum.photos/seed/carousel2/800/1000",
  "https://picsum.photos/seed/carousel3/800/1000",
  "https://picsum.photos/seed/carousel4/800/1000",
  "https://picsum.photos/seed/carousel5/800/1000",
  "https://picsum.photos/seed/carousel6/800/1000",
  "https://picsum.photos/seed/carousel7/800/1000",
  "https://picsum.photos/seed/carousel8/800/1000",
];

export const Experience = () => {
  const { camera } = useThree();
  const controls = useControls({
    Camera: folder({
      cameraZ: { value: 10,  min: 3,   max: 30,  step: 0.5 },
      cameraY: { value: 0,   min: -10, max: 10,  step: 0.5 },
      fov:     { value: 70,  min: 20,  max: 120, step: 1   },
    }),
    Carousel: folder({
      radius: { value: 5,   min: 2,   max: 15,  step: 0.5  },
      tiltX:  { value: -13, min: -90, max: 90,  step: 1    },
      scale:  { value: 1.0, min: 0.3, max: 3.0, step: 0.05 },
      scaleY: { value: 1.0, min: 0.3, max: 3.0, step: 0.05 },
    }),
    "Card Size": folder({
      imageWidth:     { value: 1.5,  min: 0.5, max: 5,   step: 0.1  },
      imageHeight:    { value: 2.5,  min: 0.5, max: 6,   step: 0.1  },
      cornerRadius:   { value: 0.1,  min: 0,   max: 0.5, step: 0.01 },
      bendAmount:     { value: 0.1,  min: 0,   max: 1,   step: 0.05 },
      widthSegments:  { value: 32,   min: 4,   max: 64,  step: 4    },
      heightSegments: { value: 32,   min: 4,   max: 64,  step: 4    },
    }),
    "Card Visuals": folder({
      centerOpacity:    { value: 1.0, min: 0,   max: 1.0, step: 0.05 },
      adjacentOpacity:  { value: 0.9, min: 0,   max: 1.0, step: 0.05 },
      farOpacity:       { value: 0.6, min: 0,   max: 1.0, step: 0.05 },
      centerSaturation: { value: 1.0, min: 0,   max: 2.0, step: 0.05 },
      farSaturation:    { value: 0.5, min: 0,   max: 2.0, step: 0.05 },
      brightness:       { value: 1.0, min: 0.1, max: 2.0, step: 0.05 },
    }),
    Physics: folder({
      friction:         { value: 95,  min: 80, max: 99,   step: 1  },
      wheelSensitivity: { value: 100, min: 1,  max: 500,  step: 5  },
      dragSensitivity:  { value: 300, min: 1,  max: 1000, step: 10 },
      enableSnapping:   true,
    }),
  });

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
        scale={controls.scale}
        scaleY={controls.scaleY}
        imageWidth={controls.imageWidth}
        imageHeight={controls.imageHeight}
        cornerRadius={controls.cornerRadius}
        bendAmount={controls.bendAmount}
        widthSegments={controls.widthSegments}
        heightSegments={controls.heightSegments}
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
