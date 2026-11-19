import type { SpecIconKey } from "../../../types/productMedia";

interface IconProps {
  className?: string;
  size?: number;
}

export function SpecIcon({
  name,
  size = 20,
  className,
}: IconProps & { name: SpecIconKey }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "screen":
      return (
        <svg {...common}>
          <rect x="5" y="2" width="14" height="20" rx="2.5" />
          <line x1="10" y1="18.5" x2="14" y2="18.5" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </svg>
      );
    case "ram":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M7 11v2M11 11v2M15 11v2M7 17v2M12 17v2M17 17v2" />
        </svg>
      );
    case "storage":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7.5" ry="3" />
          <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
          <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
        </svg>
      );
    case "battery":
      return (
        <svg {...common}>
          <rect x="2.5" y="7" width="17" height="10" rx="2" />
          <line x1="21.5" y1="10" x2="21.5" y2="14" />
          <path d="M10.5 9.5 8.5 12h3l-1.5 2.5" />
        </svg>
      );
    case "signal":
      return (
        <svg {...common}>
          <path d="M4 18v-2M8.5 18v-5M13 18v-8M17.5 18V7M21 18V5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5.2 7.5-9.8V6L12 3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "engine":
      return (
        <svg {...common}>
          <path d="M4 10h2l1.5-2h7L16 10h3a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 18h-2l-1.5 1.5h-7L7 18H4.5A1.5 1.5 0 0 1 3 16.5v-5A1.5 1.5 0 0 1 4.5 10Z" />
          <path d="M9 5h6M12 5v3M20.5 14H22" />
        </svg>
      );
    case "transmission":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M6 8v8M12 8v8M18 8v4H6" />
        </svg>
      );
    case "seats":
      return (
        <svg {...common}>
          <circle cx="9" cy="7.5" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <circle cx="17" cy="8.5" r="2.3" />
          <path d="M15.5 19a4.5 4.5 0 0 1 5.5-4.4" />
        </svg>
      );
    case "safety":
      return (
        <svg {...common}>
          <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5.2 7.5-9.8V6L12 3Z" />
          <circle cx="12" cy="11.5" r="2.5" />
          <path d="M12 14v3" />
        </svg>
      );
    case "fuel":
      return (
        <svg {...common}>
          <path d="M4 20V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V20" />
          <path d="M3 20h12M7 8h4" />
          <path d="M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0v-6l-2-2" />
        </svg>
      );
    case "sunroof":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
        </svg>
      );
    case "trunk":
      return (
        <svg {...common}>
          <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
          <path d="M3 9.5V16l9 4.5 9-4.5V9.5M12 14v6.5" />
        </svg>
      );
    case "connect":
      return (
        <svg {...common}>
          <path d="M5 12.55a11 11 0 0 1 14 0" />
          <path d="M8.5 16a6 6 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      );
  }
}

export function StarIcon({
  filled = true,
  half = false,
  size = 16,
  className,
}: IconProps & { filled?: boolean; half?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {half ? (
        <>
          <path
            d="M12 2.5 14.9 8.4l6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 2.5v14.8l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z"
            fill="currentColor"
          />
        </>
      ) : (
        <path
          d="M12 2.5 14.9 8.4l6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function TruckIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 7h12v10H2Z" />
      <path d="M14 10h4l3 3v4h-7Z" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="17.5" cy="17.5" r="2" />
    </svg>
  );
}

export function HeartIcon({
  filled = false,
  size = 20,
  className,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.5s-7.5-4.8-9.3-9.3C1.4 8 3.5 4.5 7 4.5c2 0 3.7 1.1 5 2.7 1.3-1.6 3-2.7 5-2.7 3.5 0 5.6 3.5 4.3 6.7-1.8 4.5-9.3 9.3-9.3 9.3Z" />
    </svg>
  );
}

export function Cube3DIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z" />
      <path d="M12 12 20.5 7M12 12 3.5 7M12 12v9.5" />
    </svg>
  );
}

export function ThumbsUpIcon({ size = 15, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 11v9H3v-9h4Zm0 0 4-7a2 2 0 0 1 3 1.7V10h5.2a2 2 0 0 1 1.9 2.5l-1.5 6A2 2 0 0 1 17.7 20H7" />
    </svg>
  );
}

export function ReturnIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}
