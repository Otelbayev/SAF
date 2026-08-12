import Image from "next/image";
import clsx from "clsx";

// Only the two countries on the real route ship with the site.
const PNG_FLAGS = new Set(["cn", "uz"]);

type Props = {
  code: string;
  className?: string;
  /** Width of the flag in pixels. Height auto-derived to a 3:2 aspect ratio. */
  width?: number;
  /** When true, renders a square crop (good for circular avatars). */
  square?: boolean;
};

export function Flag({ code, className, width = 24, square = false }: Props) {
  const lc = code.toLowerCase();
  const height = square ? width : Math.round(width * 0.66);

  if (PNG_FLAGS.has(lc)) {
    return (
      <span
        aria-label={code}
        className={clsx(
          "relative inline-block shrink-0 overflow-hidden ring-1 ring-black/10 dark:ring-white/15",
          square ? "rounded-md" : "rounded-[3px]",
          className,
        )}
        style={{ width, height }}
      >
        <Image
          src={`/images/${lc}.png`}
          alt={code}
          width={width * 2}
          height={height * 2}
          className="h-full w-full object-cover"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      aria-label={code}
      role="img"
      className={clsx(
        "inline-flex items-center justify-center leading-none",
        className,
      )}
      style={{
        fontSize: square ? width : Math.round(width * 0.9),
        lineHeight: 1,
      }}
    >
      {"🌐"}
    </span>
  );
}
