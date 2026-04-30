"use client";
import { useEffect, useState } from 'react';

const ARScanner = () => {
  const [mounted, setMounted] = useState(false);
  const [arReady, setArReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load scripts dynamically
    const loadScripts = async () => {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      try {
        if (!window.AFRAME) {
          await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js');
        }
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
        setArReady(true);
      } catch (e) {
        console.error("Error loading AR scripts:", e);
      }
    };

    loadScripts();

    return () => {
      // Cleanup
      const scene = document.querySelector('a-scene');
      if (scene) {
        scene.parentElement.removeChild(scene);
      }
      // Note: Video and other elements might need manual removal
      const video = document.querySelector('video');
      if (video) video.remove();
    };
  }, []);

  if (!mounted || !arReady) {
    return (
      <div className="scanner-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <div className="scanner-status">SISTEMA AR: CARGANDO PROTOCOLOS...</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>VERIFICANDO ACCESO A CÁMARA...</div>
      </div>
    );
  }

  return (
    <div className="scanner-container" style={{ background: 'transparent' }}>
      {/* Botón de volver con mayor prioridad visual */}
      <button 
        className="back-btn" 
        onClick={() => window.location.href = '/'}
        style={{ pointerEvents: 'auto', zIndex: 100 }}
      >
        &lt; ABORTAR MISIÓN
      </button>

      {/* HUD Overlay - Ahora con pointer-events: none para no bloquear el toque en la cámara */}
      <div className="scanner-hud" style={{ zIndex: 50, pointerEvents: 'none' }}>
        <div className="scanner-reticle"></div>
        <div className="scanner-info-panel" style={{ pointerEvents: 'auto' }}>
          <div className="scanner-status">SISTEMA: RASTREANDO BIO-MARCADORES...</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
            OBJECTIVOS: [CELL_001, CELL_002]<br/>
            SENSORS: ACTIVE<br/>
            GRID: STABLE
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
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Target 1: Prokaryotic */}
        <a-entity mindar-image-target="targetIndex: 0">
          <a-sphere position="0 0 0" radius="0.3" color="#FFFF00" wireframe="true" animation="property: rotation; to: 0 360 360; dur: 5000; easing: linear; loop: true"></a-sphere>
          <a-text value="PROCARIOTA" position="0 -0.6 0" align="center" color="#FFFF00" width="2"></a-text>
        </a-entity>

        {/* Target 2: Eukaryotic */}
        <a-entity mindar-image-target="targetIndex: 1">
          <a-box position="0 0 0" scale="0.4 0.4 0.4" color="#FFFF00" wireframe="true" animation="property: rotation; to: 360 360 0; dur: 5000; easing: linear; loop: true"></a-box>
          <a-text value="EUCARIOTA" position="0 -0.6 0" align="center" color="#FFFF00" width="2"></a-text>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        .mindar-ui-scanning, .mindar-ui-loading {
          z-index: 60 !important;
        }
        video {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          object-fit: cover !important;
          z-index: -1 !important;
        }
      `}</style>
    </div>
  );

};

export default ARScanner;

