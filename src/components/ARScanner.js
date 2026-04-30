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
      await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/aframe-gesture-detector.min.js");
      await loadScript("https://raw.githack.com/fcor/aframe-gesture-detector-component/master/dist/gesture-handler.js");
      setScriptsLoaded(true);
    };
    loadAll();
  }, []);

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-yellow-400">CARGANDO MODELOS 3D...</div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: yes;"
        embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false" gesture-detector
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        <a-assets>
          {/* Aquí es donde cargarías tus modelos locales descargados */}
          {/* <a-asset-item id="celulaModel" src="/models/celula_eucariota.glb"></a-asset-item> */}
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* --- CÉLULA PROCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity gesture-handler scale="0.5 0.5 0.5" rotation="0 0 0">
              {/* Modelo 3D Real (Si tienes el archivo cell.glb en public) */}
              <a-gltf-model src="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" position="0 0 0" rotation="0 0 0"></a-gltf-model>
              
              <a-text value="MODELO 3D CARGADO" color="#FFFF00" position="0 -1 0" align="center"></a-text>
           </a-entity>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity gesture-handler scale="0.5 0.5 0.5" rotation="0 0 0">
              {/* Modelo de ejemplo (Casco Táctico) para probar que el 3D real funciona */}
              <a-gltf-model src="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" position="0 0 0"></a-gltf-model>
              
              <a-text value="PROTOCOLO EUCARIOTA" color="#FFFF00" position="0 -1 0" align="center"></a-text>
           </a-entity>
        </a-entity>
      </a-scene>

      <style jsx global>{`
        video { z-index: 0 !important; }
        .back-btn { position: absolute; top: 20px; left: 20px; z-index: 100; background: yellow; color: black; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ARScanner;
