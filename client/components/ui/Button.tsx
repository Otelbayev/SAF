import clsx from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-medium leading-snug transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&>svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-800 text-white hover:bg-brand-700 shadow-(--shadow-soft) hover:shadow-(--shadow-glow) hover:-translate-y-0.5",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-surface-2 hover:-translate-y-0.5",
  ghost: "text-foreground hover:bg-surface-2",
  outline:
    "border border-brand-800 text-brand-800 hover:bg-brand-800 hover:text-white dark:border-brand-400 dark:text-brand-200 dark:hover:bg-brand-800 dark:hover:text-white",
};

// min-h rather than h: Uzbek and Russian labels are long and must be allowed to
// wrap to a second line instead of spilling out of a fixed-height pill.
const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-14 px-8 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "className"> & {
    href: string;
  };

/** `tel:`, `mailto:` and absolute URLs are not routes — they get a plain `<a>`. */
const isExternalHref = (href: string) => !href.startsWith("/");

export function Button(props: ButtonAsButton | ButtonAsLink) {
  // Pull the styling props out of `rest` here, once: spreading them back onto
  // the element would leak `variant`/`size` into the DOM as invalid attributes
  // and let the caller's raw `className` overwrite the computed classes.
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;
  const classes = clsx(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest as Omit<ButtonAsLink, keyof CommonProps>;
    if (isExternalHref(href)) {
      return (
        <a href={href} className={classes} {...linkProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as Omit<ButtonAsButton, keyof CommonProps>)}>
      {children}
    </button>
  );
}
