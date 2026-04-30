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

  // Añadimos el script de gestos dinámicamente
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/aframe-gesture-detector.min.js";
    document.head.appendChild(script);
    
    const script2 = document.createElement('script');
    script2.src = "https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/gesture-handler.js";
    document.head.appendChild(script2);
  }, []);

  return (
    <div className="scanner-container" style={{ background: 'transparent' }}>
      {/* Botón de volver */}
      <button 
        className="back-btn" 
        onClick={() => window.location.href = '/'}
        style={{ pointerEvents: 'auto', zIndex: 100 }}
      >
        &lt; ABORTAR MISIÓN
      </button>

      {/* HUD Overlay */}
      <div className="scanner-hud" style={{ zIndex: 50, pointerEvents: 'none' }}>
        <div className="scanner-reticle"></div>
        <div className="scanner-info-panel" style={{ pointerEvents: 'auto' }}>
          <div className="scanner-status">SISTEMA: RASTREANDO...</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--highlight-yellow)', opacity: 0.8 }}>
            [ DIAGNÓSTICO: {arReady ? 'SISTEMA CARGADO' : 'INICIALIZANDO...'} ]<br/>
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

        {/* Target 1: Prokaryota (Estructura más compleja) */}
        <a-entity mindar-image-target="targetIndex: 0">
          <a-entity 
            gesture-handler
            rotation="0 0 0"
          >
             {/* Membrana externa */}
             <a-sphere radius="0.4" color="#FFFF00" wireframe="true" opacity="0.3"></a-sphere>
             {/* Núcleo / ADN */}
             <a-torus-knot radius="0.15" radius-tubular="0.01" color="#FFFF00" animation="property: rotation; to: 360 360 0; dur: 3000; easing: linear; loop: true"></a-torus-knot>
             
             {/* Etiquetas Flotantes */}
             <a-entity position="0.6 0.3 0">
                <a-plane width="0.4" height="0.1" color="#000" opacity="0.8"></a-plane>
                <a-text value="DNA_CORE" color="#FFFF00" width="1.5" align="center"></a-text>
             </a-entity>
             <a-entity position="0.6 -0.3 0">
                <a-plane width="0.4" height="0.1" color="#000" opacity="0.8"></a-plane>
                <a-text value="CAPSULE_V1" color="#FFFF00" width="1.5" align="center"></a-text>
             </a-entity>

             <a-text value="PROCARIOTA" position="0 -0.8 0" align="center" color="#FFFF00" width="3"></a-text>
          </a-entity>
        </a-entity>

        {/* Target 2: Eukaryotic (Estructura con núcleo definido) */}
        <a-entity mindar-image-target="targetIndex: 1">
          <a-entity 
            gesture-handler
            rotation="0 0 0"
          >
             {/* Citoplasma */}
             <a-sphere radius="0.45" color="#FFFF00" wireframe="true" opacity="0.1"></a-sphere>
             {/* Núcleo Central */}
             <a-sphere radius="0.15" color="#FFFF00" position="0 0 0">
                <a-sphere radius="0.16" color="#000" wireframe="true" opacity="0.5"></a-sphere>
             </a-sphere>
             {/* Organelas (Mitocondrias simuladas) */}
             <a-cylinder radius="0.05" height="0.15" position="0.25 0.1 0" rotation="45 45 0" color="#FFFF00" wireframe="true"></a-cylinder>
             <a-cylinder radius="0.05" height="0.15" position="-0.2 -0.2 0" rotation="10 0 45" color="#FFFF00" wireframe="true"></a-cylinder>

             {/* Etiquetas Flotantes */}
             <a-entity position="0.6 0.4 0">
                <a-plane width="0.5" height="0.12" color="#000" opacity="0.8"></a-plane>
                <a-text value="NUCLEUS_ACTIVE" color="#FFFF00" width="1.8" align="center"></a-text>
             </a-entity>
             <a-entity position="-0.7 -0.3 0">
                <a-plane width="0.6" height="0.12" color="#000" opacity="0.8"></a-plane>
                <a-text value="ENERGY_PLANT_01" color="#FFFF00" width="1.8" align="center"></a-text>
             </a-entity>

             <a-text value="EUCARIOTA" position="0 -0.9 0" align="center" color="#FFFF00" width="3"></a-text>
          </a-entity>
        </a-entity>
      </a-scene>


      <style jsx global>{`
        /* FORZAR TRANSPARENCIA TOTAL EN LA PÁGINA */
        html, body {
          background: transparent !important;
          background-image: none !important;
          background-color: transparent !important;
        }
        
        .mindar-ui-scanning, .mindar-ui-loading {
          z-index: 110 !important;
        }
        
        /* El video debe estar por encima de todo pero debajo del HUD */
        video {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          object-fit: cover !important;
          z-index: 0 !important;
          display: block !important;
        }
      `}</style>
    </div>
  );


};

export default ARScanner;

