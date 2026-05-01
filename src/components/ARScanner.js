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
      
      // Registrar componente de gestos táctiles directamente
      if (window.AFRAME && !window.AFRAME.components['touch-gestures']) {
        window.AFRAME.registerComponent('touch-gestures', {
          init: function () {
            this.initialScale = this.el.object3D.scale.clone();
            this.scaleFactor = 1;
            this.initialDistance = 0;
            this.initialRotation = 0;
            this.currentRotationY = 0;

            // Pinch para escalar
            this.el.sceneEl.addEventListener('touchstart', (e) => {
              if (e.touches.length === 2) {
                this.initialDistance = this.getDistance(e.touches);
              }
            });

            this.el.sceneEl.addEventListener('touchmove', (e) => {
              if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches);
                if (this.initialDistance > 0) {
                  const delta = currentDistance / this.initialDistance;
                  this.scaleFactor = Math.min(Math.max(delta, 0.3), 5);
                  this.el.object3D.scale.set(
                    this.initialScale.x * this.scaleFactor,
                    this.initialScale.y * this.scaleFactor,
                    this.initialScale.z * this.scaleFactor
                  );
                }
              } else if (e.touches.length === 1) {
                // Un dedo para rotar
                const touch = e.touches[0];
                if (this.lastTouchX !== undefined) {
                  const deltaX = touch.clientX - this.lastTouchX;
                  this.currentRotationY += deltaX * 0.5;
                  this.el.object3D.rotation.y = THREE.MathUtils.degToRad(this.currentRotationY);
                }
                this.lastTouchX = touch.clientX;
              }
            });

            this.el.sceneEl.addEventListener('touchend', () => {
              this.initialDistance = 0;
              this.initialScale = this.el.object3D.scale.clone();
              this.lastTouchX = undefined;
            });
          },
          getDistance: function (touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
          }
        });
      }
      
      setScriptsLoaded(true);
    };
    loadAll();
  }, []);

  if (!mounted || !scriptsLoaded) return <div className="bg-black h-screen flex items-center justify-center text-cyan-400 font-mono text-center px-4">
    CARGANDO MODELOS 3D...<br/>
    <span className="text-[10px] opacity-50 block mt-2">Gestos: 1 dedo = rotar | 2 dedos = agrandar/achicar</span>
  </div>;

  return (
    <div className="scanner-container">
      <button className="back-btn" onClick={() => window.location.href = '/'}>&lt; VOLVER</button>

      <a-scene
        mindar-image="imageTargetSrc: /targets.mind; autoStart: true; uiLoading: no;"
        embedded color-space="sRGB" renderer="colorManagement: true; antialias: true"
        xr-mode-ui="enabled: false"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5 }}
      >
        <a-assets timeout="30000">
          <a-asset-item id="eucariotaModel" src="/eucariota/scene.gltf"></a-asset-item>
          <a-asset-item id="procariotaModel" src="/eve3d_-_celula_procariota.glb"></a-asset-item>
          <a-asset-item id="vegetalModel" src="/celula_vegetal.glb"></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-light type="ambient" intensity="1.5"></a-light>
        <a-light type="directional" position="1 2 3" intensity="1"></a-light>

        {/* --- CÉLULA PROCARIOTA 3D REAL --- */}
        <a-entity mindar-image-target="targetIndex: 0">
           <a-entity position="0 0.3 0" touch-gestures
              animation="property: position; to: 0 0.45 0; dur: 2000; dir: alternate; easing: easeInOutSine; loop: true"
              animation__rotate="property: rotation; to: 0 360 0; dur: 8000; easing: linear; loop: true">
              <a-gltf-model src="#procariotaModel" scale="0.05 0.05 0.05" rotation="-90 0 0"></a-gltf-model>
           </a-entity>
           <a-text value="PROKARYOTA 3D" color="#A0FF00" position="0 -0.3 0" align="center" width="2"></a-text>
        </a-entity>

        {/* --- CÉLULA EUCARIOTA 3D REAL --- */}
        <a-entity mindar-image-target="targetIndex: 1">
           <a-entity position="0 0.3 0" touch-gestures
              animation="property: position; to: 0 0.45 0; dur: 2500; dir: alternate; easing: easeInOutSine; loop: true"
              animation__rotate="property: rotation; to: 0 360 0; dur: 10000; easing: linear; loop: true">
              <a-gltf-model src="#eucariotaModel" scale="0.7 0.7 0.7" rotation="-90 0 0"></a-gltf-model>
           </a-entity>
           <a-text value="EUKARYOTA 3D" color="#00FFFF" position="0 -0.3 0" align="center" width="2"></a-text>
        </a-entity>

        {/* --- CÉLULA VEGETAL 3D REAL --- */}
        <a-entity mindar-image-target="targetIndex: 2">
           <a-entity position="0 0.3 0" touch-gestures
              animation="property: position; to: 0 0.45 0; dur: 2000; dir: alternate; easing: easeInOutSine; loop: true"
              animation__rotate="property: rotation; to: 0 360 0; dur: 9000; easing: linear; loop: true">
              <a-gltf-model src="#vegetalModel" scale="0.5 0.5 0.5" rotation="-90 0 0"></a-gltf-model>
           </a-entity>
           <a-text value="VEGETAL CELL 3D" color="#00FF88" position="0 -0.3 0" align="center" width="2"></a-text>
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
