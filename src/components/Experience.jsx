import { Suspense } from "react";
import { useControls } from "leva";
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
  const controls = useControls({
    imageWidth:    { value: 1.5,  min: 0.5, max: 5,   step: 0.1 },
    imageHeight:   { value: 2.5,  min: 0.5, max: 6,   step: 0.1 },
    cornerRadius:  { value: 0.1,  min: 0,   max: 0.5, step: 0.01 },
    bendAmount:    { value: 0.1,  min: 0,   max: 1,   step: 0.05 },
    centerOpacity: { value: 1.0,  min: 0.1, max: 1.0, step: 0.05 },
    adjacentOpacity: { value: 0.9, min: 0.1, max: 1.0, step: 0.05 },
    farOpacity:    { value: 0.6,  min: 0.0, max: 1.0, step: 0.05 },
    friction:      { value: 95,   min: 80,  max: 99,  step: 1 },
    enableSnapping: true,
  });

  return (
    <Suspense fallback={null}>
      <ImageCarousel
        images={IMAGES}
        imageWidth={controls.imageWidth}
        imageHeight={controls.imageHeight}
        cornerRadius={controls.cornerRadius}
        bendAmount={controls.bendAmount}
        centerOpacity={controls.centerOpacity}
        adjacentOpacity={controls.adjacentOpacity}
        farOpacity={controls.farOpacity}
        friction={controls.friction / 100}
        enableSnapping={controls.enableSnapping}
      />
    </Suspense>
  );
};
