"use client";

import type { CSSProperties } from "react";
import clsx from "clsx";

type Props = {
  /** Container width in px; height and depth scale from it. */
  size?: number;
  /** Seconds for one full rotation. */
  duration?: number;
  className?: string;
  /** Draws the receding perspective road beneath the container. */
  road?: boolean;
  label?: string;
};

/**
 * A CSS-3D shipping container, optionally above a perspective road. Six faces
 * built from the `.cargo-*` utilities in globals.css — the corrugated walls and
 * SAF marking are pure CSS, so this ships no 3D library.
 */
export function CargoScene({
  size = 150,
  duration = 22,
  className,
  road = false,
  label = "SAF",
}: Props) {
  const h = Math.round(size * 0.62);
  const d = Math.round(size * 0.74);

  const faces: {
    key: string;
    transform: string;
    style?: CSSProperties;
    plate?: boolean;
    mark?: boolean;
  }[] = [
    { key: "front", transform: `translateZ(${d / 2}px)`, mark: true },
    {
      key: "back",
      transform: `rotateY(180deg) translateZ(${d / 2}px)`,
      mark: true,
    },
    {
      key: "left",
      transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
      style: { width: d, left: "50%", marginLeft: -d / 2 },
    },
    {
      key: "right",
      transform: `rotateY(90deg) translateZ(${size / 2}px)`,
      style: { width: d, left: "50%", marginLeft: -d / 2 },
    },
    {
      key: "top",
      transform: `rotateX(90deg) translateZ(${h / 2}px)`,
      style: { height: d, top: "50%", marginTop: -d / 2 },
      plate: true,
    },
    {
      key: "bottom",
      transform: `rotateX(-90deg) translateZ(${h / 2}px)`,
      style: { height: d, top: "50%", marginTop: -d / 2 },
      plate: true,
    },
  ];

  return (
    // No position class here: the caller supplies one, and a hardcoded
    // `relative` would beat their `absolute inset-0` and collapse the stage.
    <div className={clsx("scene-3d", className)} aria-hidden>
      {road ? (
        <>
          <div className="road-3d" />
          <div className="cargo-shadow" />
        </>
      ) : null}

      <div className="cargo-anchor">
        <div className="cargo-float">
          <div
            className="cargo"
            style={
              {
                "--cargo-w": `${size}px`,
                "--cargo-h": `${h}px`,
                "--cargo-dur": `${duration}s`,
              } as CSSProperties
            }
          >
            {faces.map((f) => (
              <div
                key={f.key}
                className={clsx("cargo-face", f.plate && "cargo-face--plate")}
                style={{ ...f.style, transform: f.transform }}
              >
                {f.mark ? <span className="cargo-mark">{label}</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
