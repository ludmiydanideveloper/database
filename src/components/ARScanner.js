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
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        setDebugMsg(`Cargando ${name}...`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Fallo ${name}`));
        document.head.appendChild(script);
      });
    };

    const loadAll = async () => {
      try {
        await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js', 'Motor 3D');
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js', 'Escáner AR');
        try {
           await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/aframe-gesture-detector.min.js", "Gestos A");
           await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/gesture-handler.js", "Gestos B");
        } catch (e) { console.warn("Sin gestos"); }
        setScriptsLoaded(true);
      } catch (e) { setDebugMsg(`ERROR: ${e.message}`); }
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
          <div className="text-xl mb-4 animate-pulse uppercase">Protocolo de Carga</div>
          <div className="text-[10px] text-white/50">{debugMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="scanner-container" style={{ background: 'transparent' }}>
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; ABORTAR MISIÓN</button>

      <div className="scanner-hud" style={{ zIndex: 50, pointerEvents: 'none' }}>
        <div className="scanner-reticle"></div>
        <div className="scanner-info-panel">
          <div className="scanner-status text-highlight-yellow font-bold">ESTADO: OPERATIVO</div>
          <div className="text-[9px] opacity-70 text-white">MODO: ANÁLISIS BIO-TÁCTICO V2.0</div>
        </div>
      </div>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: yes; uiError: yes; uiScanning: yes;"
        embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"
        gesture-detector
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* --- CÉLULA PROCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 0">
          <a-entity gesture-handler scale="1.2 1.2 1.2">
             {/* Cuerpo Celular */}
             <a-sphere radius="0.45" color="#FFFF00" wireframe="true" opacity="0.2" animation="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true"></a-sphere>
             
             {/* ADN Circular */}
             <a-torus-knot radius="0.2" radius-tubular="0.01" p="2" q="3" color="#FFFF00" animation="property: rotation; to: 360 0 360; dur: 4000; easing: linear; loop: true"></a-torus-knot>
             
             {/* Etiquetas */}
             <a-entity position="0.5 0.3 0">
                <a-line start="0 0 0" end="-0.3 -0.2 0" color="#FFFF00" opacity="0.6"></a-line>
                <a-text value="NUCLEOIDE (ADN)" color="#FFFF00" width="1.8" position="0.1 0 0"></a-text>
             </a-entity>
             
             <a-entity position="-0.5 -0.4 0">
                <a-line start="0 0 0" end="0.3 0.2 0" color="#FFFF00" opacity="0.6"></a-line>
                <a-text value="PARED_CELULAR" color="#FFFF00" width="1.8" position="-0.8 0 0" align="right"></a-text>
             </a-entity>
          </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 1">
          <a-entity gesture-handler scale="1.3 1.3 1.3">
             {/* Citoplasma Externo */}
             <a-sphere radius="0.5" color="#FFFF00" wireframe="true" opacity="0.1" animation="property: rotation; to: 360 360 0; dur: 20000; easing: linear; loop: true"></a-sphere>
             
             {/* Núcleo Central Pulsante */}
             <a-sphere radius="0.18" color="#FFFF00" animation="property: scale; to: 1.1 1.1 1.1; dur: 1000; dir: alternate; loop: true">
                <a-sphere radius="0.2" color="#FFFF00" wireframe="true" opacity="0.4"></a-sphere>
             </a-sphere>

             {/* Organelas (Mitocondrias y Vacuolas) */}
             <a-cylinder radius="0.04" height="0.15" position="0.3 0.2 0" rotation="45 45 0" color="#FFFF00" wireframe="true"></a-cylinder>
             <a-cylinder radius="0.04" height="0.15" position="-0.25 -0.2 0" rotation="10 0 45" color="#FFFF00" wireframe="true"></a-cylinder>
             <a-sphere radius="0.08" position="-0.3 0.2 0" color="#FFFF00" wireframe="true" opacity="0.5"></a-sphere>

             {/* Etiquetas Tácticas */}
             <a-entity position="0.6 0.4 0">
                <a-line start="0 0 0" end="-0.4 -0.3 0" color="#FFFF00" opacity="0.8"></a-line>
                <a-text value="NUCLEUS_V100" color="#FFFF00" width="2" position="0.1 0 0"></a-text>
             </a-entity>

             <a-entity position="-0.6 -0.5 0">
                <a-line start="0 0 0" end="0.3 0.2 0" color="#FFFF00" opacity="0.8"></a-line>
                <a-text value="ENERGY_UNIT_01" color="#FFFF00" width="2" position="-1.2 0 0" align="right"></a-text>
             </a-entity>
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
