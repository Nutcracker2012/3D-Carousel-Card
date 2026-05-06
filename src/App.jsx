import { Canvas, extend } from "@react-three/fiber";
import { Experience } from "./components/Experience";

import * as THREE from "three/webgpu";

function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 12], fov: 50 }}
      gl={async (props) => {
        extend(THREE);
        const renderer = new THREE.WebGPURenderer(props);
        await renderer.init();
        return renderer;
      }}
    >
      <color attach="background" args={["#ffffff"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
