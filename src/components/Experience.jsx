import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { ImageCarousel } from "./ImageCarousel";

const IMAGES = [
  "https://picsum.photos/seed/art1/800/1000",
  "https://picsum.photos/seed/art2/800/1000",
  "https://picsum.photos/seed/art3/800/1000",
  "https://picsum.photos/seed/art4/800/1000",
  "https://picsum.photos/seed/art5/800/1000",
  "https://picsum.photos/seed/art6/800/1000",
];

export const Experience = () => {
  return (
    <>
      <OrbitControls enablePan={false} />
      <Suspense fallback={null}>
        <ImageCarousel images={IMAGES} />
      </Suspense>
    </>
  );
};
