import { useEffect, useState } from "react";
import { Cube3DIcon } from "../productIcons/ProductIcons";
import "./Model3DViewer.css";

interface Model3DViewerProps {
  src: string;
  poster?: string;
  alt: string;
}

export default function Model3DViewer({ src, poster, alt }: Model3DViewerProps) {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (activated) {
      import("@google/model-viewer");
    }
  }, [activated]);

  return (
    <div className="model3DWrapper">
      <div className="model3DViewer">
        {!activated ? (
          <div className="model3DPosterState">
            {poster && (
              <img
                src={poster}
                alt={`Vista previa 3D de ${alt}`}
                className="model3DPosterImg"
              />
            )}
            <div className="model3DPosterOverlay">
              <button
                type="button"
                className="model3DLaunchBtn"
                onClick={() => setActivated(true)}
              >
                <Cube3DIcon size={22} />
                <span>Explorar en 3D interactivo</span>
              </button>
              <p className="model3DPosterNote">
                Rotá 360° y acercá los detalles en tiempo real
              </p>
            </div>
          </div>
        ) : (
          <model-viewer
            key={src}
            className="model3DViewerElement"
            src={src}
            poster={poster}
            alt={`Modelo 3D de ${alt}`}
            reveal="auto"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            touch-action="pan-y"
          />
        )}
      </div>

      <div className="model3DFooter">
        <span className="model3DHintItem">🖱️ Arrastrá para girar 360°</span>
        <span className="model3DHintItem">🔍 Rueda o pellizco para hacer zoom</span>
        {activated && (
          <button
            type="button"
            className="model3DResetBtn"
            onClick={() => setActivated(false)}
          >
            Pausar visor 3D
          </button>
        )}
      </div>
    </div>
  );
}
