import { useEffect, useRef, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

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
    if (!shouldLoad) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => setIsLoaded(true);
    viewer.addEventListener("load", handleLoad);
    return () => viewer.removeEventListener("load", handleLoad);
  }, [shouldLoad, src]);

  return (
    <div className="model3DWrapper">
      <div ref={containerRef} className="model3DViewer">
        {shouldLoad && (
          <model-viewer
            ref={viewerRef}
            key={src}
            className="model3DViewerElement"
            src={src}
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

        {!isLoaded && (
          <div className="model3DLoadingOverlay" role="status" aria-live="polite">
            <div className="model3DSpinnerWrap">
              <span className="model3DSpinner" aria-hidden="true" />
              <Cube3DIcon size={22} />
            </div>
            <p className="model3DLoadingText">Cargando modelo 3D...</p>
          </div>
        )}
      </div>

      <div className="model3DFooter">
        <span className="model3DHintItem">🖱️ Arrastrá para girar 360°</span>
        <span className="model3DHintItem">🔍 Rueda o pellizco para hacer zoom</span>
        {isLoaded && (
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
