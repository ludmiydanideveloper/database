"use client";
import Image from "next/image";


export default function Home() {
  return (
    <div className="hud-container">
      <header className="hud-header">
        <div>
          <h1 className="hud-title">BIO-DATA SCANNER</h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            ESTADO DEL SISTEMA: <span style={{ color: 'var(--highlight-yellow)' }}>ONLINE</span>
          </p>
        </div>
        <div className="hud-version">v1.0.4 // AR_DATABASE</div>
      </header>

      <main className="bio-grid">
        {/* Prokaryotic Cell */}
        <div className="tactical-frame">
          <div className="tactical-frame-inner">
            <div className="image-container">
              <Image 
                src="/prokaryotic.png" 
                alt="Célula Procariota" 
                width={600} 
                height={600} 
                className="cell-image"
                priority
              />
              <div className="image-overlay"></div>
              <div className="scan-line"></div>
            </div>
            <div className="frame-info">
              <span className="sample-name">CÉLULA PROCARIOTA</span>
              <span className="sample-id">SCAN_ID_001</span>
            </div>
          </div>
        </div>

        {/* Eukaryotic Cell */}
        <div className="tactical-frame">
          <div className="tactical-frame-inner">
            <div className="image-container">
              <Image 
                src="/eukaryotic.png" 
                alt="Célula Eucariota" 
                width={600} 
                height={600} 
                className="cell-image"
                priority
              />
              <div className="image-overlay"></div>
              <div className="scan-line"></div>
            </div>
            <div className="frame-info">
              <span className="sample-name">CÉLULA EUCARIOTA</span>
              <span className="sample-id">SCAN_ID_002</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="hud-footer">
        <div className="instruction-box">
          <p className="instruction-text">
            &gt; Apunta tu Visor Táctico a estas bio-muestras para el análisis 3D
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>[ LINKED ]</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>[ SYNC_READY ]</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>[ ENCRYPTED ]</span>
          </div>
        </div>

        <button 
          className="launch-scanner-btn"
          onClick={() => window.location.href = '/scanner'}
        >
          INICIAR ESCÁNER TÁCTICO
        </button>
      </footer>


      {/* Decorative HUD Elements */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
        0x45 0x55 0x4B 0x41 0x52 0x59 0x4F 0x54 0x45
      </div>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
        LATENCY: 0.02ms // SIGNAL: STABLE
      </div>
    </div>
  );
}

