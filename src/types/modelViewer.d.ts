import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface ModelViewerAttributes extends HTMLAttributes<HTMLElement> {
  src?: string;
  poster?: string;
  alt?: string;
  reveal?: "auto" | "interaction" | "manual";
  loading?: "auto" | "lazy" | "eager";
  "camera-controls"?: boolean | string;
  "auto-rotate"?: boolean | string;
  "shadow-intensity"?: string | number;
  "touch-action"?: string;
  "environment-image"?: string;
  exposure?: string | number;
  ar?: boolean;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }
}
