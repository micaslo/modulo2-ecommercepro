import { useEffect } from "react";
import "./Model3DViewer.css";

interface Model3DViewerProps {
  src: string;
  poster?: string;
  alt: string;
}

export default function Model3DViewer({ src, poster, alt }: Model3DViewerProps) {
  // Carga la librería solo cuando se monta este componente
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <div className="model3DViewer">
      <model-viewer
        className="model3DViewerElement"
        src={src}
        poster={poster}
        alt={`Modelo 3D de ${alt}`}
        reveal="interaction"
        loading="lazy"
        camera-controls
        auto-rotate
        shadow-intensity="1"
      />
    </div>
  );
}