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
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        setDebugMsg(`Cargando ${name}...`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          console.log(`${name} cargado`);
          resolve();
        };
        script.onerror = () => reject(new Error(`Fallo ${name}`));
        document.head.appendChild(script);
      });
    };

    const loadAll = async () => {
      try {
        // 1. Lo vital (A-Frame)
        await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js', 'Motor 3D');
        // 2. Lo vital (MindAR)
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js', 'Escáner AR');
        
        // 3. Lo opcional (Gestos) - Si esto falla, seguimos igual
        try {
           await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/aframe-gesture-detector.min.js", "Control Táctil A");
           await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/gesture-handler.js", "Control Táctil B");
        } catch (e) {
           console.warn("Gestos no cargados, continuando sin ellos");
        }

        setScriptsLoaded(true);
      } catch (e) {
        setDebugMsg(`ERROR: ${e.message}. Reintenta.`);
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
      <div className="scanner-container flex items-center justify-center bg-black text-highlight-yellow font-mono" style={{ height: '100vh' }}>
        <div className="text-center p-6 border border-highlight-yellow/30 rounded-lg">
          <div className="text-xl mb-4 animate-pulse">SISTEMA: PROTOCOLOS</div>
          <div className="text-xs mb-6 text-white/70">{debugMsg}</div>
          <button 
            onClick={() => setScriptsLoaded(true)}
            className="text-[10px] border border-highlight-yellow px-4 py-2 hover:bg-highlight-yellow hover:text-black transition-colors"
          >
            FORZAR INICIO (SKIP LOADING)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scanner-container" style={{ background: 'transparent' }}>
      <button className="back-btn" onClick={() => window.location.href = '/'}>
        &lt; ABORTAR MISIÓN
      </button>

      <div className="scanner-hud" style={{ zIndex: 50, pointerEvents: 'none' }}>
        <div className="scanner-reticle"></div>
        <div className="scanner-info-panel">
          <div className="scanner-status">SISTEMA: ONLINE</div>
          <div className="text-[10px] opacity-60">
            [ SENSOR: ACTIVE ] [ MODE: AR_TACTICAL ]
          </div>
        </div>
      </div>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: yes; uiError: yes; uiScanning: yes;"
        embedded
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        gesture-detector
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
          <a-entity gesture-handler>
             <a-sphere radius="0.4" color="#FFFF00" wireframe="true" opacity="0.3"></a-sphere>
             <a-torus-knot radius="0.15" radius-tubular="0.01" color="#FFFF00" animation="property: rotation; to: 360 360 0; dur: 3000; easing: linear; loop: true"></a-torus-knot>
             <a-text value="PROCARIOTA" position="0 -0.8 0" align="center" color="#FFFF00" width="3"></a-text>
          </a-entity>
        </a-entity>

        <a-entity mindar-image-target="targetIndex: 1">
          <a-entity gesture-handler>
             <a-sphere radius="0.45" color="#FFFF00" wireframe="true" opacity="0.1"></a-sphere>
             <a-sphere radius="0.15" color="#FFFF00"></a-sphere>
             <a-text value="EUCARIOTA" position="0 -0.9 0" align="center" color="#FFFF00" width="3"></a-text>
          </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        html, body { background: transparent !important; }
        video { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 0; }
      `}</style>
    </div>
  );
};

export default ARScanner;
