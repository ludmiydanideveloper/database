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

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-yellow-400">ACTIVANDO NÚCLEOS BIÓTICOS...</div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no;"
        embedded color-space="sRGB" renderer="colorManagement: true, antialias: true"
        xr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-light type="ambient" intensity="1"></a-light>
        <a-light type="point" position="2 4 4" intensity="2" color="#FFFF00"></a-light>

        {/* --- CÉLULA PROCARIOTA TÁCTICA --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity scale="0.8 0.8 0.8" animation="property: rotation; to: 0 360 0; dur: 8000; easing: linear; loop: true">
              {/* Cuerpo: Cápsula de cristal */}
              <a-cylinder radius="0.25" height="0.6" color="#FFFF00" opacity="0.1" transparent="true">
                 <a-sphere position="0 0.3 0" radius="0.25" color="#FFFF00" opacity="0.1" transparent="true"></a-sphere>
                 <a-sphere position="0 -0.3 0" radius="0.25" color="#FFFF00" opacity="0.1" transparent="true"></a-sphere>
                 <a-cylinder radius="0.26" height="0.6" wireframe="true" color="#FFFF00" opacity="0.3"></a-cylinder>
              </a-cylinder>
              
              {/* ADN: El núcleo de energía */}
              <a-torus-knot radius="0.12" radius-tubular="0.005" p="2" q="9" color="#FFFF00"
                 animation="property: scale; to: 1.1 1.1 1.1; dur: 400; dir: alternate; loop: true"></a-torus-knot>

              {/* Flagelo Táctico */}
              <a-entity position="0 -0.5 0">
                 <a-cylinder radius="0.005" height="0.4" color="#FFFF00" rotation="10 0 0" 
                    animation="property: rotation; to: -10 0 20; dur: 300; dir: alternate; loop: true"></a-cylinder>
              </a-entity>

              <a-text value="ANALYSIS: PROKARYOTA" color="#FFFF00" position="0 -1 0" align="center" width="2"></a-text>
           </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA TÁCTICA --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity scale="1 1 1" animation="property: rotation; to: 360 360 0; dur: 15000; easing: linear; loop: true">
              {/* Membrana: Doble Capa de Rejilla */}
              <a-sphere radius="0.4" color="#00FFFF" opacity="0.1" transparent="true">
                 <a-sphere radius="0.42" color="#00FFFF" wireframe="true" opacity="0.2"></a-sphere>
              </a-sphere>

              {/* Núcleo: Sol Central */}
              <a-sphere radius="0.12" color="#FFFF00">
                 <a-torus radius="0.18" radius-tubular="0.005" color="#FFFF00" 
                    animation="property: rotation; to: 360 0 360; dur: 2000; easing: linear; loop: true"></a-torus>
              </a-sphere>

              {/* Organelas: Cristales de Energía */}
              <a-octahedron radius="0.05" position="0.2 0.2 0.1" color="#00FFFF" wireframe="true"></a-octahedron>
              <a-octahedron radius="0.05" position="-0.2 -0.1 -0.1" color="#00FFFF" wireframe="true"></a-octahedron>
              <a-octahedron radius="0.05" position="0.1 -0.2 0.2" color="#00FFFF" wireframe="true"></a-octahedron>

              <a-text value="ANALYSIS: EUKARYOTA" color="#00FFFF" position="0 -0.8 0" align="center" width="2"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { position: fixed; top: 20px; left: 20px; z-index: 100; background: #FFFF00; color: black; border: none; padding: 10px 20px; font-family: monospace; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default ARScanner;
