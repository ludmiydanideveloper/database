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

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-yellow-400 font-mono">CARGANDO MODELOS BIOLÓGICOS REALES...</div>;

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

        {/* --- CÉLULA PROCARIOTA REAL --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity scale="1 1 1" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true">
              <a-gltf-model src="/prokaryote.glb" position="0 0 0"></a-gltf-model>
              <a-text value="BIO-ANALYSIS: PROKARYOTA" color="#00FF00" position="0 -1 0" align="center" width="2"></a-text>
           </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA REAL --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity scale="1 1 1" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true">
              <a-gltf-model src="/cell.glb" position="0 0 0"></a-gltf-model>
              <a-text value="BIO-ANALYSIS: EUKARYOTA" color="#00FFFF" position="0 -1 0" align="center" width="2"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { 
          position: fixed; top: 20px; left: 20px; z-index: 100; 
          background: rgba(0,0,0,0.8); color: #00FFFF; border: 1px solid #00FFFF;
          padding: 8px 16px; font-family: monospace; font-size: 12px; cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ARScanner;
