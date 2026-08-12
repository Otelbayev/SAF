"use client";

import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

type Props = { dict: Dictionary };

export function ForWhom({ dict }: Props) {
  return (
    <section id="for-whom" className="relative py-16 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.forWhom.eyebrow}
          title={dict.forWhom.title}
          subtitle={dict.forWhom.description}
        />

        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3 sm:mt-14">
          {dict.forWhom.items.map((item, i) => (
            <li key={item}>
              <Reveal
                delay={i * 0.06}
                y={16}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition hover:border-brand-500/40 hover:shadow-(--shadow-soft) sm:text-base"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-800 text-white">
                  <Icon.Check size={13} />
                </span>
                {item}
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal
          delay={0.2}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border bg-surface p-6 text-center"
        >
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {dict.forWhom.note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
