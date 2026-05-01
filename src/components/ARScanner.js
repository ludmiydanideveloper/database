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
      await loadScript('https://aframe.io/releases/1.4.2/aframe.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
      setScriptsLoaded(true);
    };
    loadAll();
  }, []);

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-cyan-400 font-mono">PREPARANDO BIO-VISOR...</div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no;"
        embedded color-space="sRGB" renderer="colorManagement: true; antialias: true"
        xr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-assets>
          <img id="prokaryoticImg" src="/prokaryotic_3d.png" crossOrigin="anonymous" />
          <img id="eukaryoticImg" src="/eukaryotic_3d.png" crossOrigin="anonymous" />
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        <a-light type="ambient" intensity="1.5"></a-light>

        {/* --- CÉLULA PROCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           {/* Sombra en el "piso" para dar profundidad */}
           <a-ring radius-inner="0" radius-outer="0.35" color="#000000" opacity="0.4" rotation="0 0 0" position="0 0 0"></a-ring>

           {/* Célula flotante */}
           <a-entity position="0 0.6 -0.3" 
              animation="property: position; to: 0 0.75 -0.3; dur: 2000; dir: alternate; easing: easeInOutSine; loop: true"
              animation__rotate="property: rotation; to: 0 360 0; dur: 6000; easing: linear; loop: true">
              
              <a-image src="#prokaryoticImg" width="0.9" height="0.9" opacity="0.95"
                 rotation="0 0 0"></a-image>
              
              {/* Anillo de Escaneo giratorio */}
              <a-ring radius-inner="0.48" radius-outer="0.5" color="#FFFF00" opacity="0.7" rotation="90 0 0" position="0 0 0"
                 animation="property: scale; to: 1.1 1.1 1.1; dur: 1500; dir: alternate; easing: easeInOutSine; loop: true"></a-ring>
           </a-entity>

           {/* Etiqueta flotante debajo */}
           <a-text value="PROKARYOTA DETECTED" color="#FFFF00" position="0 -0.1 0" align="center" width="2"></a-text>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           {/* Sombra en el "piso" */}
           <a-ring radius-inner="0" radius-outer="0.35" color="#000000" opacity="0.4" rotation="0 0 0" position="0 0 0"></a-ring>

           {/* Célula flotante */}
           <a-entity position="0 0.6 -0.3" 
              animation="property: position; to: 0 0.75 -0.3; dur: 2500; dir: alternate; easing: easeInOutSine; loop: true"
              animation__rotate="property: rotation; to: 0 360 0; dur: 8000; easing: linear; loop: true">
              
              <a-image src="#eukaryoticImg" width="0.9" height="0.9" opacity="0.95"
                 rotation="0 0 0"></a-image>
              
              {/* Anillo de Escaneo giratorio */}
              <a-ring radius-inner="0.48" radius-outer="0.5" color="#00FFFF" opacity="0.7" rotation="90 0 0" position="0 0 0"
                 animation="property: scale; to: 1.1 1.1 1.1; dur: 1500; dir: alternate; easing: easeInOutSine; loop: true"></a-ring>
           </a-entity>

           {/* Etiqueta flotante debajo */}
           <a-text value="EUKARYOTA DETECTED" color="#00FFFF" position="0 -0.1 0" align="center" width="2"></a-text>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { 
          position: fixed; top: 20px; left: 20px; z-index: 100; 
          background: rgba(0,0,0,0.85); color: #00FFFF; border: 1px solid #00FFFF;
          padding: 8px 16px; font-family: monospace; font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ARScanner;
