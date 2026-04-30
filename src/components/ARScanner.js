"use client";
import { useEffect, useState } from 'react';

const ARScanner = () => {
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [arReady, setArReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadScripts = async () => {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      try {
        // Carga secuencial para evitar conflictos
        if (!window.AFRAME) {
          await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js');
        }
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
        
        // Scripts de gestos
        await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/aframe-gesture-detector.min.js");
        await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/gesture-handler.js");
        
        setScriptsLoaded(true);
        setArReady(true);
      } catch (e) {
        console.error("Error loading AR scripts:", e);
      }
    };

    loadScripts();

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
        <div className="animate-pulse text-center">
          <div className="text-xl mb-2">SISTEMA: CARGANDO PROTOCOLOS...</div>
          <div className="text-xs opacity-50">INICIALIZANDO VISOR TÁCTICO</div>
        </div>
      </div>
    );
  }

  return (
    <div className="scanner-container" style={{ background: 'transparent' }}>
      <button 
        className="back-btn" 
        onClick={() => window.location.href = '/'}
        style={{ pointerEvents: 'auto', zIndex: 100 }}
      >
        &lt; ABORTAR MISIÓN
      </button>

      <div className="scanner-hud" style={{ zIndex: 50, pointerEvents: 'none' }}>
        <div className="scanner-reticle"></div>
        <div className="scanner-info-panel" style={{ pointerEvents: 'auto' }}>
          <div className="scanner-status">SISTEMA: RASTREANDO...</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--highlight-yellow)', opacity: 0.8 }}>
            [ DIAGNÓSTICO: {arReady ? 'SISTEMA ONLINE' : 'INICIALIZANDO...'} ]<br/>
            [ GESTOS: ACTIVADOS (Pinch/Rotate) ]
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
             
             <a-entity position="0.6 0.3 0">
                <a-plane width="0.4" height="0.1" color="#000" opacity="0.8"></a-plane>
                <a-text value="DNA_CORE" color="#FFFF00" width="1.5" align="center"></a-text>
             </a-entity>

             <a-text value="PROCARIOTA" position="0 -0.8 0" align="center" color="#FFFF00" width="3"></a-text>
          </a-entity>
        </a-entity>

        <a-entity mindar-image-target="targetIndex: 1">
          <a-entity gesture-handler>
             <a-sphere radius="0.45" color="#FFFF00" wireframe="true" opacity="0.1"></a-sphere>
             <a-sphere radius="0.15" color="#FFFF00"></a-sphere>
             
             <a-entity position="0.6 0.4 0">
                <a-plane width="0.5" height="0.12" color="#000" opacity="0.8"></a-plane>
                <a-text value="NUCLEUS_ACTIVE" color="#FFFF00" width="1.8" align="center"></a-text>
             </a-entity>

             <a-text value="EUCARIOTA" position="0 -0.9 0" align="center" color="#FFFF00" width="3"></a-text>
          </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        html, body {
          background: transparent !important;
          background-image: none !important;
        }
        video {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          object-fit: cover !important;
          z-index: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default ARScanner;
