// src/components/Doll.jsx
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei";
import AnimatedModel from "./AnimatedModel";
import { ClipLoader } from "react-spinners";
import * as THREE from "three";

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

// === Auto-rotation + screenshot capture ===
function AutoCapture({ modelRef }) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    let running = false;

    async function exportFrames() {
      if (!modelRef.current || running) return;
      running = true;

      console.log("⏳ Waiting for final render...");
      await new Promise((res) => setTimeout(res, 1200));

      const total = 12;
      const angleStep = 360 / total;

      // 🔥 Viktigt: kör render loop under export
      const oldLoop = gl.getContextAttributes().preserveDrawingBuffer;

      gl.getContext().canvas.style.background = "transparent";
      gl.setClearColor(0x000000, 0);
      scene.background = null;

      for (let i = 0; i < total; i++) {
        modelRef.current.rotation.y = THREE.MathUtils.degToRad(i * angleStep);

        // 🔥 Vänta på render
        await new Promise((res) => requestAnimationFrame(res));

        gl.render(scene, camera);

        // 🔥 Vänta på GPU
        await new Promise((res) => setTimeout(res, 80));

        const png = gl.domElement.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = png;
        link.download = `frame${i}.png`;
        link.click();

        console.log("Saved frame:", i);
      }

      console.log("✔ Done!");
    }

    exportFrames();
  }, [modelRef, gl, scene, camera]);

  return null;
}



export default function Doll() {
  const modelRef = useRef();

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
          textShadow: "0 0 12px rgba(34,105,220,0.8)",
          fontWeight: 600,
          letterSpacing: "1px",
          fontSize: "1.5rem",
          zIndex: 10,
        }}
      >
        Generating Try-On Frames...
      </h2>

      {/* === Loader === */}
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
            gl.setClearColor(0x000000, 0);
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

          {/* Modell med ref så vi kan rotera */}
          <Bounds fit clip observe margin={1.4}>
            <group ref={modelRef} position={[0, -1.2, 0]} scale={1.1}>
              <AnimatedModel />
            </group>
          </Bounds>

          {/* Ta frames automatiskt */}
          <AutoCapture modelRef={modelRef} />

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
