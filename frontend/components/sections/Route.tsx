"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/Flag";
import { VideoBackdrop } from "@/components/ui/VideoBackdrop";
import { destination, originKeys, origins, tariffKeys, tariffs } from "@/lib/site";

type Props = { dict: Dictionary };

/** Where each origin's connector leaves the left edge of the 128×80 viewBox. */
const MERGE_Y = 40;
const CONNECTORS = [
  { from: 18, delay: 0 },
  { from: 62, delay: 1.2 },
];

function Endpoint({
  code,
  label,
  place,
  hubTag,
  align,
  image,
}: {
  code: string;
  label: string;
  place: string;
  hubTag?: string;
  align: "start" | "end";
  image?: { src: string; alt: string };
}) {
  return (
    <div
      className={`relative isolate flex items-center gap-4 overflow-hidden rounded-3xl border border-white/20 p-5 ${
        image ? "" : "bg-brand-950/50 backdrop-blur-md"
      } ${align === "end" ? "md:flex-row-reverse md:text-right" : ""}`}
    >
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="-z-10 object-cover"
          />
          {/* The city photo is texture, not subject: without a heavy scrim the
              white label and place name lose contrast over the bright sky. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950/95 via-brand-950/80 to-brand-950/55"
          />
        </>
      ) : null}
      <Flag code={code} width={44} square className="h-11 w-11 shrink-0" />
      <div className="min-w-0">
        <div
          className={`flex items-center gap-2 ${align === "end" ? "md:justify-end" : ""}`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            {label}
          </span>
          {hubTag ? (
            <span className="rounded-full border border-brand-300/50 bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-brand-100">
              {hubTag}
            </span>
          ) : null}
        </div>
        <div className="mt-1 truncate text-lg font-semibold text-white">
          {place}
        </div>
      </div>
    </div>
  );
}

export function Route({ dict }: Props) {
  return (
    <section id="route" className="relative overflow-hidden py-16 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.route.subtitle}
          title={dict.route.title}
          subtitle={dict.route.description}
        />

        <Reveal
          from="zoom"
          className="relative isolate mx-auto mt-10 max-w-6xl overflow-hidden rounded-4xl border border-border shadow-(--shadow-elevated) sm:mt-14"
        >
          <VideoBackdrop
            src="/videos/5secondtuck.mp4"
            poster="/images/5secondtuck-poster.png"
            grade="duotone"
            className="-z-10"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-grid opacity-[0.1]"
          />
          <div aria-hidden className="sheen -z-10 left-0" />

          {/* Status chips */}
          <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {dict.route.doorToDoor}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <Icon.Truck size={12} />
              {dict.route.transportLabel} · {dict.route.transportValue}
            </span>
          </div>

          {/* Corridor endpoints */}
          <div className="relative p-5 sm:p-8">
            <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
              {/* Two warehouses in China feeding one destination. */}
              <div className="space-y-3">
                {originKeys.map((key) => {
                  const { code, image } = origins[key];
                  return (
                    <Endpoint
                      key={key}
                      code={code}
                      label={dict.route.originLabel}
                      place={dict.route.origins[key]}
                      hubTag={dict.route.hubTag}
                      align="start"
                      image={
                        image
                          ? {
                              src: image.path,
                              alt: dict.seo.alt[image.altKey],
                            }
                          : undefined
                      }
                    />
                  );
                })}
              </div>

              <div className="relative h-16 md:h-32 md:w-32">
                <svg
                  viewBox="0 0 128 80"
                  className="absolute inset-0 h-full w-full text-brand-300"
                  aria-hidden
                >
                  {CONNECTORS.map((c) => (
                    <path
                      key={c.from}
                      d={`M4 ${c.from} L124 ${MERGE_Y}`}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.35"
                      strokeWidth="2"
                      strokeDasharray="7 7"
                      strokeLinecap="round"
                    />
                  ))}
                  {/* cx and cy both interpolate linearly, so the dot tracks the
                      straight connector exactly. */}
                  {CONNECTORS.map((c) => (
                    <motion.circle
                      key={c.from}
                      r="4"
                      fill="currentColor"
                      initial={{ cx: 4, cy: c.from, opacity: 0 }}
                      animate={{
                        cx: 124,
                        cy: MERGE_Y,
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: c.delay,
                      }}
                    />
                  ))}
                </svg>
              </div>

              <Endpoint
                code={destination.code}
                label={dict.route.destinationLabel}
                place={dict.route.destination}
                align="end"
              />
            </div>

            {/* Transit time per tariff */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tariffKeys.map((key) => (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 text-center backdrop-blur-md ${
                    tariffs[key].featured
                      ? "border-brand-300/50 bg-brand-400/20"
                      : "border-white/15 bg-brand-950/50"
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    {dict.services[key].name}
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {tariffs[key].min}–{tariffs[key].max}{" "}
                    <span className="text-base font-normal text-white/60">
                      {dict.services.daysLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
