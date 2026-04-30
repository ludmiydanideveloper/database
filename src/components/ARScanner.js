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
      await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
      setScriptsLoaded(true);
    };
    loadAll();
  }, []);

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-cyan-400">CARGANDO VISOR TÁCTICO...</div>;

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
        <a-light type="directional" position="0 10 10" intensity="1.5"></a-light>

        {/* --- TARGET 0: TEST CON PATITO (PRUEBA DE FUEGO) --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity scale="0.5 0.5 0.5" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 5000; easing: linear; loop: true">
              {/* Este modelo SIEMPRE funciona */}
              <a-gltf-model src="https://cdn.aframe.io/examples/ar/models/duck.glb"></a-gltf-model>
              <a-text value="SISTEMA: TEST_MODE_DUCK" color="yellow" position="0 -1 0" align="center"></a-text>
           </a-entity>
        </a-entity>

        {/* --- TARGET 1: TU CÉLULA CON ESCALA GIGANTE --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity scale="50 50 50" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true">
              <a-gltf-model src="/cell.glb"></a-gltf-model>
              <a-text value="SISTEMA: ANALIZANDO_CELULA" color="#00FFFF" position="0 -0.05 0" align="center" width="0.5"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { position: fixed; top: 20px; left: 20px; z-index: 100; background: yellow; color: black; border: none; padding: 10px 20px; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default ARScanner;
