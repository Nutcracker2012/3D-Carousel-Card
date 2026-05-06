import { Canvas, extend } from "@react-three/fiber";
import { Experience } from "./components/Experience";

import * as THREE from "three/webgpu";

function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 10], fov: 70 }}
      gl={async (props) => {
        extend(THREE);
        const renderer = new THREE.WebGPURenderer(props);
        await renderer.init();
        return renderer;
      }}
    >
      <color attach="background" args={["#e2e2e2"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
