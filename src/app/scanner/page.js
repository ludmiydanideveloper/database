import ARScanner from "@/components/ARScanner";

export const metadata = {
  title: "TACTICAL SCANNER | BIO-AR",
  description: "Modo de escaneo táctico para análisis celular",
};

export default function ScannerPage() {
  return (
    <main>
      <ARScanner />
    </main>
  );
}
