"use client";
import { useEffect, useState } from 'react';

const ARScanner = () => {
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [debugMsg, setDebugMsg] = useState("Iniciando...");

  useEffect(() => {
    setMounted(true);
    const loadScript = (src, name) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        setDebugMsg(`Cargando ${name}...`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(name));
        document.head.appendChild(script);
      });
    };

    const loadAll = async () => {
      try {
        await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js', 'Motor 3D');
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js', 'AR Core');
        setScriptsLoaded(true);
      } catch (e) {
        setDebugMsg(`Error en ${e.message}`);
      }
    };
    loadAll();

    return () => {
      const scene = document.querySelector('a-scene');
      if (scene) scene.remove();
      const video = document.querySelector('video');
      if (video) video.remove();
    };
  }, []);

  if (!mounted || !scriptsLoaded) {
    return (
      <div className="scanner-container flex flex-col items-center justify-center bg-black text-yellow-400 font-mono" style={{ height: '100vh' }}>
        <div className="text-xl mb-4 animate-pulse">SISTEMA: CARGANDO</div>
        <div className="text-[10px] mb-8">{debugMsg}</div>
        <button onClick={() => setScriptsLoaded(true)} className="border border-yellow-400 px-4 py-2 text-[10px]">FORZAR INICIO</button>
      </div>
    );
  }

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: yes;"
        embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* --- CÉLULA PROCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity scale="1 1 1" rotation="0 0 0">
              {/* Si descargas un GLB y lo llamas procariota.glb en public, usa esta linea: */}
              {/* <a-gltf-model src="/procariota.glb"></a-gltf-model> */}
              
              <a-sphere radius="0.4" color="yellow" wireframe="true"></a-sphere>
              <a-text value="SISTEMA: PROCARIOTA" color="yellow" position="0 -0.8 0" align="center"></a-text>
           </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity scale="1 1 1" rotation="0 0 0">
              {/* Si descargas un GLB y lo llamas eucariota.glb en public, usa esta linea: */}
              {/* <a-gltf-model src="/eucariota.glb"></a-gltf-model> */}
              
              <a-sphere radius="0.4" color="yellow">
                 <a-sphere radius="0.45" color="yellow" wireframe="true" opacity="0.3"></a-sphere>
              </a-sphere>
              <a-text value="SISTEMA: EUCARIOTA" color="yellow" position="0 -0.8 0" align="center"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { position: absolute; top: 20px; left: 20px; z-index: 100; background: yellow; color: black; border: none; padding: 10px 20px; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default ARScanner;
