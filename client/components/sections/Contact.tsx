import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";

type Props = { dict: Dictionary };

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-soft)">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-white">
          {icon}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          {title}
        </h3>
      </div>
      <div className="mt-4 text-sm">{children}</div>
    </div>
  );
}

export function Contact({ dict }: Props) {
  return (
    <section id="contact" className="relative py-16 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.contact.subtitle}
          title={dict.contact.title}
          subtitle={dict.contact.description}
        />
      </Container>

      <Container className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <InfoCard
            icon={<Icon.Phone size={18} />}
            title={dict.contact.phoneLabel}
          >
            <ul className="space-y-1">
              {siteConfig.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p}`}
                    className="text-lg font-medium text-foreground hover:text-brand-700 dark:hover:text-brand-200"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard
            icon={<Icon.Clock size={18} />}
            title={dict.contact.hoursLabel}
          >
            <p className="text-foreground">{dict.contact.hoursWeek}</p>
            <p className="text-muted">{dict.contact.hoursSun}</p>
          </InfoCard>

          <InfoCard
            icon={<Icon.MapPin size={18} />}
            title={dict.contact.addressLabel}
          >
            <p className="font-medium text-foreground">
              {siteConfig.legalName}
            </p>
            <p className="mt-1 text-muted">{dict.contact.address}</p>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center gap-2 text-sm text-brand-700 hover:underline dark:text-brand-200"
            >
              {dict.contact.mapCta} <Icon.ArrowRight size={14} />
            </a>
          </InfoCard>

          <InfoCard
            icon={<Icon.Instagram size={18} />}
            title={dict.contact.socialLabel}
          >
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-foreground hover:text-brand-700 dark:hover:text-brand-200"
            >
              @{siteConfig.instagramHandle}
              <Icon.ArrowRight size={14} />
            </a>
          </InfoCard>
        </div>

        <div className="lg:col-span-3">
          <ContactForm dict={dict} />
        </div>
      </Container>

      <Container className="mt-8 sm:mt-12">
        <div className="overflow-hidden rounded-3xl border border-border shadow-(--shadow-soft)">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-white">
                <Icon.MapPin size={16} />
              </span>
              <span className="text-sm font-medium text-foreground">
                {dict.contact.mapTitle}
              </span>
            </div>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="shrink-0 text-sm text-brand-700 hover:underline dark:text-brand-200"
            >
              {dict.contact.mapCta}
            </a>
          </div>
          <iframe
            title="SAF Logistics on Yandex Maps"
            src={siteConfig.mapEmbed}
            className="h-105 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </Container>
    </section>
  );
}
