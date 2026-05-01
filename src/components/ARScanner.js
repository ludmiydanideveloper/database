"use client";
import { useEffect, useState } from 'react';

const ARScanner = () => {
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadScript = (src) => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const loadAll = async () => {
      // Bajamos a la versión 1.4.2 que es más estable para AR
      await loadScript('https://aframe.io/releases/1.4.2/aframe.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
      setScriptsLoaded(true);
    };
    loadAll();
  }, []);

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-yellow-400">REPARANDO MOTOR 3D...</div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no;"
        embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-light type="ambient" intensity="2"></a-light>

        {/* --- TARGET 0: TEST CON CUBO Y MODELO --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           {/* CUBO ROJO DE SEGURIDAD (Si ves esto, el motor funciona) */}
           <a-box position="0 0 0" scale="0.3 0.3 0.3" color="red" wireframe="false"></a-box>
           
           {/* EL PATITO (Para ver si el sistema de archivos ya despertó) */}
           <a-gltf-model src="https://cdn.aframe.io/examples/ar/models/duck.glb" scale="0.2 0.2 0.2" position="0 0.4 0"></a-gltf-model>
           
           <a-text value="Cubo=Motor OK | Pato=Archivos OK" color="red" position="0 -0.6 0" align="center" width="2"></a-text>
        </a-entity>

        {/* --- TARGET 1: TEST CON ESFERA Y CELULA --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-sphere position="0 0 0" scale="0.2 0.2 0.2" color="blue" opacity="0.5"></a-sphere>
           <a-gltf-model src="/cell.glb" scale="10 10 10" position="0 0.3 0"></a-gltf-model>
           <a-text value="Esfera=Motor OK | Celula=Archivos OK" color="blue" position="0 -0.6 0" align="center" width="2"></a-text>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { position: fixed; top: 20px; left: 20px; z-index: 100; background: red; color: white; border: none; padding: 10px 20px; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default ARScanner;
