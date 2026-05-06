# 3D Carousel Card

An interactive 3D image carousel built with React Three Fiber and WebGPU, inspired by Spline's Cylinder effect.

## Getting Started

```bash
yarn        # install dependencies
yarn dev    # start dev server at http://localhost:5174
```

## Features

- **WebGPU renderer** via `three/webgpu` and React Three Fiber v9
- **TSL (Three Shading Language)** node materials with:
  - Cylinder bend effect on each card (parabolic Z-displacement)
  - SDF-based rounded corners mask
  - Per-card saturation and brightness uniforms
- **Physics-based interaction** — drag, mouse wheel, and touch with velocity/friction and snap-to-card
- **Live Leva control panel** with grouped settings

## Controls

| Group | Setting | Description |
|---|---|---|
| **Camera** | cameraZ / cameraY | Camera position |
| | fov | Field of view (20–120°) |
| **Carousel** | radius | Ring radius — how far cards sit from center |
| | tiltX | Cylinder tilt on X axis (matches Spline's Rotation X) |
| | scale | Uniform scale of the whole carousel |
| | scaleY | Vertical stretch of the cylinder |
| **Card Size** | imageWidth / imageHeight | Card dimensions |
| | cornerRadius | Rounded corner radius via SDF |
| | bendAmount | Cylinder curvature strength |
| | widthSegments / heightSegments | Plane geometry subdivisions (bend smoothness) |
| **Card Visuals** | centerOpacity / adjacentOpacity / farOpacity | Opacity falloff by distance from front |
| | centerSaturation / farSaturation | Saturation falloff |
| | brightness | Global brightness multiplier |
| **Physics** | friction | Drag decay rate |
| | wheelSensitivity / dragSensitivity | Input responsiveness |
| | enableSnapping | Snap to nearest card on release |

## Tech Stack

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) v9
- [Three.js](https://threejs.org/) v0.182 (WebGPU)
- [drei](https://github.com/pmndrs/drei)
- [Leva](https://github.com/pmndrs/leva) — live controls panel
- [Vite](https://vitejs.dev/)

## Reference

Cylinder effect parameters adapted from [Spline Hana 3D carousel tutorial](https://www.youtube.com/shorts/lKXmGmzfmd0).
Code reference: [wass08/r3f-carousel-slider](https://github.com/wass08/r3f-carousel-slider).
