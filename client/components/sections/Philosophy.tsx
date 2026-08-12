"use client";

import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { VideoBackdrop } from "@/components/ui/VideoBackdrop";

type Props = { dict: Dictionary };

const reasonKeys = ["time", "routes", "control", "partnership"] as const;
const reasonIcons = {
  time: Icon.Clock,
  routes: Icon.Truck,
  control: Icon.Shield,
  partnership: Icon.Sparkle,
} as const;

export function Philosophy({ dict }: Props) {
  return (
    <section id="philosophy" className="relative py-16 sm:py-32">
      <Container>
        <Reveal
          from="zoom"
          className="relative isolate overflow-hidden rounded-4xl border border-border p-8 text-white shadow-(--shadow-elevated) sm:p-14"
        >
          <VideoBackdrop
            src="/videos/a-large-white-semi-truck-is-driving-down-a-highway-free-video.mp4"
            poster="/images/a-large-white-semi-truck-is-driving-down-a-highway-free-video-poster.png"
            grade="duotone"
            parallax
            className="-z-10"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-grid opacity-20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl"
          />
          <div aria-hidden className="sheen -z-10 left-0" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
              {dict.philosophy.eyebrow}
            </span>

            <h2 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {dict.philosophy.title}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg">
              {dict.philosophy.positioning}
            </p>
          </div>

          <div className="relative mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
              {dict.philosophy.reasonsTitle}
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {reasonKeys.map((key, i) => {
                const Ico = reasonIcons[key];
                return (
                  <Reveal
                    key={key}
                    delay={i * 0.08}
                    className="rounded-3xl border border-white/20 bg-brand-950/45 p-5 backdrop-blur-md transition hover:border-brand-300/40 hover:bg-brand-950/60"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <Ico size={20} />
                    </div>
                    <h4 className="mt-4 text-lg font-semibold">
                      {dict.philosophy.reasons[key].title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {dict.philosophy.reasons[key].desc}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
