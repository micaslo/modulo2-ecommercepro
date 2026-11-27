import { useEffect, useRef, useState } from "react";
import {
  isStoredModelRef,
  loadModelBlobFromIdb,
} from "../../../utils/model3dStorage";
import { Cube3DIcon } from "../productIcons/ProductIcons";
import "./Model3DViewer.css";

interface Model3DViewerProps {
  src: string;
  alt: string;
}

export default function Model3DViewer({ src, alt }: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [idbBlobUrl, setIdbBlobUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const needsIdb = isStoredModelRef(src);
  const resolvedSrc = needsIdb ? idbBlobUrl : src;

  useEffect(() => {
    if (!shouldLoad || !needsIdb) return;
    let active = true;
    let createdUrl: string | null = null;

    loadModelBlobFromIdb(src)
      .then((record) => {
        if (!active) return;
        if (!record) {
          setLoadError(
            "El archivo 3D guardado localmente ya no está disponible en este navegador.",
          );
          return;
        }
        createdUrl = URL.createObjectURL(record.blob);
        setLoadError(null);
        setIdbBlobUrl(createdUrl);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("No se pudo cargar el modelo 3D desde el almacenamiento local.");
      });

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [needsIdb, shouldLoad, src]);

  useEffect(() => {
    if (shouldLoad) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (shouldLoad) {
      import("@google/model-viewer");
    }
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !resolvedSrc) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setLoadError(null);
      setIsLoaded(true);
    };
    const handleError = () => {
      setLoadError("No se pudo renderizar este modelo 3D.");
      setIsLoaded(true);
    };
    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, [shouldLoad, resolvedSrc]);

  return (
    <div className="model3DWrapper">
      <div ref={containerRef} className="model3DViewer">
        {shouldLoad && resolvedSrc && !loadError && (
          <model-viewer
            ref={viewerRef}
            key={resolvedSrc}
            className="model3DViewerElement"
            src={resolvedSrc}
            alt={`Modelo 3D de ${alt}`}
            reveal="auto"
            camera-controls=""
            auto-rotate={autoRotate ? "" : undefined}
            shadow-intensity="1"
            touch-action="pan-y"
          >
            <div slot="progress-bar" className="model3DProgressBarHidden" />
          </model-viewer>
        )}

        {loadError ? (
          <div className="model3DLoadingOverlay" role="alert">
            <Cube3DIcon size={24} />
            <p className="model3DLoadingText">{loadError}</p>
          </div>
        ) : (
          !isLoaded && (
            <div className="model3DLoadingOverlay" role="status" aria-live="polite">
              <div className="model3DSpinnerWrap">
                <span className="model3DSpinner" aria-hidden="true" />
                <Cube3DIcon size={22} />
              </div>
              <p className="model3DLoadingText">Cargando modelo 3D...</p>
            </div>
          )
        )}
      </div>

      <div className="model3DFooter">
        <span className="model3DHintItem">🖱️ Arrastrá para girar 360°</span>
        <span className="model3DHintItem">🔍 Rueda o pellizco para hacer zoom</span>
        {isLoaded && !loadError && (
          <button
            type="button"
            className="model3DResetBtn"
            onClick={() => setAutoRotate((prev) => !prev)}
          >
            {autoRotate ? "Pausar rotación" : "Reanudar rotación"}
          </button>
        )}
      </div>
    </div>
  );
}
