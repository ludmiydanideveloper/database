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
      // Usamos 1.4.1, la más compatible para GLTF en móviles
      await loadScript('https://aframe.io/releases/1.4.1/aframe.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
      setScriptsLoaded(true);
    };
    loadAll();
  }, []);

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-cyan-400 font-mono text-center px-4">
    PREPARANDO VISOR BIOLÓGICO REALISTA...<br/><span className="text-[10px] opacity-50">Si se traba, usa Chrome o Safari directamente.</span>
  </div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no;"
        embedded color-space="sRGB" 
        renderer="colorManagement: true; antialias: true; physicallyCorrectLights: true"
        xr-mode-ui="enabled: false"
        gltf-model="dracoDecoderPath: https://www.gstatic.com/draco/versioned/decoders/1.5.6/;"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-assets>
           <a-asset-item id="cellModel" src="/cell.glb"></a-asset-item>
           <a-asset-item id="prokaryoteModel" src="/prokaryote.glb"></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-light type="ambient" intensity="1.5"></a-light>
        <a-light type="directional" position="1 2 1" intensity="1"></a-light>

        {/* --- CÉLULA PROCARIOTA REAL --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity scale="1 1 1" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true">
              <a-gltf-model src="#prokaryoteModel" crossorigin="anonymous"></a-gltf-model>
              <a-text value="PROKARYOTA ANALYSIS" color="#A0FF00" position="0 -1 0" align="center" width="2.5"></a-text>
           </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA REAL --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity scale="1 1 1" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 12000; easing: linear; loop: true">
              <a-gltf-model src="#cellModel" crossorigin="anonymous"></a-gltf-model>
              <a-text value="EUKARYOTA ANALYSIS" color="#00FFFF" position="0 -1 0" align="center" width="2.5"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { 
          position: fixed; top: 20px; left: 20px; z-index: 100; 
          background: rgba(0,0,0,0.8); color: #00FFFF; border: 1px solid #00FFFF;
          padding: 8px 16px; font-family: monospace; font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ARScanner;
