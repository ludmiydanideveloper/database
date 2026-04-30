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

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-yellow-400 font-mono">INICIALIZANDO LABORATORIO BIO-3D...</div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; ABORTAR</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no;"
        embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* --- CÉLULA PROCARIOTA (ESTILO TÁCTICO) --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 15000; easing: linear; loop: true">
              {/* Cápsula (Membrana externa) */}
              <a-cylinder radius="0.25" height="0.8" color="#A0FF00" opacity="0.2" transparent="true">
                 <a-sphere position="0 0.4 0" radius="0.25" color="#A0FF00" opacity="0.2"></a-sphere>
                 <a-sphere position="0 -0.4 0" radius="0.25" color="#A0FF00" opacity="0.2"></a-sphere>
              </a-cylinder>
              
              {/* ADN (Nucleoide) central vibrante */}
              <a-torus-knot radius="0.1" radius-tubular="0.005" p="3" q="7" color="#FFFF00" 
                 animation="property: scale; to: 1.2 1.2 1.2; dur: 500; dir: alternate; loop: true"></a-torus-knot>

              {/* Flagelo (Cola) */}
              <a-entity position="0 -0.6 0" rotation="0 0 0">
                 <a-cylinder radius="0.01" height="0.5" color="#FFFF00" position="0 -0.25 0"
                    animation="property: rotation; to: 0 0 20; dur: 200; dir: alternate; loop: true"></a-cylinder>
              </a-entity>

              {/* Pili (Pelos tácticos) */}
              {[...Array(8)].map((_, i) => (
                <a-cylinder key={i} radius="0.005" height="0.15" color="#FFFF00" 
                   rotation={`${Math.random()*360} ${Math.random()*360} 0`}
                   position={`${(Math.random()-0.5)*0.4} ${(Math.random()-0.5)*0.8} 0.2`}></a-cylinder>
              ))}

              <a-text value="STATUS: PROCARIOTA" color="#FFFF00" position="0 -1 0" align="center" width="2"></a-text>
           </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA (BIO-TECNOLÓGICA) --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity rotation="0 0 0" animation="property: rotation; to: 360 0 0; dur: 20000; easing: linear; loop: true">
              {/* Membrana (Esfera de cristal) */}
              <a-sphere radius="0.5" color="#40E0D0" opacity="0.15" transparent="true">
                 <a-sphere radius="0.51" color="#40E0D0" wireframe="true" opacity="0.1"></a-sphere>
              </a-sphere>

              {/* Núcleo Complejo */}
              <a-sphere radius="0.15" color="#FFFF00">
                 <a-sphere radius="0.18" color="#FFFF00" wireframe="true" opacity="0.5" 
                    animation="property: rotation; to: 0 360 360; dur: 3000; easing: linear; loop: true"></a-sphere>
              </a-sphere>

              {/* Mitocondrias (Pequeñas cápsulas) */}
              <a-entity position="0.3 0.2 0" rotation="45 45 45">
                 <a-cylinder radius="0.04" height="0.12" color="#FFD700" wireframe="true"></a-cylinder>
                 <a-text value="ATP+" color="#FFD700" position="0 0.1 0" width="1" align="center"></a-text>
              </a-entity>

              <a-entity position="-0.2 -0.3 0.2" rotation="-20 10 0">
                 <a-cylinder radius="0.04" height="0.12" color="#FFD700" wireframe="true"></a-cylinder>
              </a-entity>

              {/* Aparato de Golgi (Discos) */}
              <a-torus radius="0.25" radius-tubular="0.005" arc="180" rotation="90 0 0" color="#40E0D0" opacity="0.5"></a-torus>
              <a-torus radius="0.28" radius-tubular="0.005" arc="180" rotation="100 0 0" color="#40E0D0" opacity="0.3"></a-torus>

              <a-text value="STATUS: EUCARIOTA" color="#FFFF00" position="0 -1 0" align="center" width="2"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { 
          position: fixed; top: 20px; left: 20px; z-index: 100; 
          background: rgba(0,0,0,0.8); color: #FFFF00; border: 1px solid #FFFF00;
          padding: 8px 16px; font-family: monospace; font-size: 12px; cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ARScanner;
