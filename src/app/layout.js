import "./globals.css";

export const metadata = {
  title: "BIO-AR DATABASE | Tactical Manual",
  description: "Base de datos de bio-muestras para escaneo AR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

