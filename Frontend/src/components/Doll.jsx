// src/components/Doll.jsx
import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei";
import AnimatedModel from "./AnimatedModel";
import { ClipLoader } from "react-spinners";

useGLTF.preload("/doll.glb");

// === Fix: uppdaterar canvas automatiskt när komponenten visas ===
function CanvasInvalidator() {
  const { invalidate, camera } = useThree();

  useEffect(() => {
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate]);

  return null;
}

export default function Doll() {
  return (
    <div
      className="doll-container"
      style={{
        width: "100%",
        height: "650px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: "-10rem",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      {/* === Text ovanför dockan === */}
      <h2
        style={{
          position: "absolute",
          top: "1rem",
          textAlign: "center",
          color: "#3b82f6",
          textShadow: "0 0 12px rgba(34, 105, 220, 0.8)",
          fontWeight: 600,
          letterSpacing: "1px",
          fontSize: "1.5rem",
          zIndex: 10,
        }}
      >
        AI Outfit Preview! 👗{" "}
        <span
          style={{
            color: "#3b82f6",
            textShadow: "0 0 12px rgba(34, 105, 220, 0.8)",
            fontSize: "1.2rem",
          }}
        >
          Coming Soon...
        </span>
      </h2>

      {/* === Loader över Canvas === */}
      <Suspense
        fallback={
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0,0,0,0.05)",
              zIndex: 5,
            }}
          >
            <ClipLoader color="#3b82f6" size={50} />
          </div>
        }
      >
        <Canvas
          resize={{ scroll: false, offsetSize: true }}
          shadows
          frameloop="demand"
          style={{ backgroundColor: "transparent", width: "100%", height: "100%" }}
          gl={{ preserveDrawingBuffer: true, alpha: true }}
          onCreated={({ gl, scene }) => {
            const bodyBg = getComputedStyle(document.body).backgroundColor;
            gl.setClearColor(bodyBg, 1);
            scene.background = null;
          }}
          camera={{
            position: [0, 1.8, 3.5],
            fov: 35,
            near: 0.1,
            far: 100,
          }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 5, -5]} intensity={2.5} />
          <directionalLight position={[2, 5, 3]} intensity={2.5} />
          <directionalLight position={[-2, 5, 2]} intensity={2.5} />

          <CanvasInvalidator />

          {/* === 3D-modell === */}
          <Bounds fit clip observe margin={1.4}>
            <group position={[0, -1.2, 0]} scale={1.1}>
              <AnimatedModel />
            </group>
          </Bounds>

          <OrbitControls
            target={[0, 0, 0]}
            minDistance={3.5}
            maxDistance={7}
            maxPolarAngle={Math.PI / 2}
            enablePan={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

