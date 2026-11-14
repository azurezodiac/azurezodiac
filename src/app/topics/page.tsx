import type { Metadata } from "next";
import Link from "next/link";
import { HealingDisclaimer } from "@/components/HealingDisclaimer";
import { LanguageToggle } from "@/components/LanguageToggle";
import { absoluteUrl } from "@/lib/seo";
import { buildTopicalMesh, getTopicIntelligence } from "@/lib/seo-intelligence";
import { SEO_TOPICS } from "@/lib/seo-topics";

const MESH = buildTopicalMesh();
const ALL_PHONETICS = Array.from(
  new Set(
    SEO_TOPICS.flatMap((topic) => getTopicIntelligence(topic).phoneticLattice),
  ),
);

export const metadata: Metadata = {
  title: {
    absolute:
      "Spiritual Topics: Jadoo Sihr Jinnat Bandish Taweez Reiki | Redeemysoul",
  },
  description:
    "Browse spiritual healing topics: jadoo, sihr, sifli sihr, jinnat, aseeb, bandish, taweez, magic grimoire, Spiritual Reiki, SAMADA Energies, ruqyah Karachi — Spiritual Healing Shazli. Phonetic + AI-intent coverage for Karachi seekers.",
  keywords: ALL_PHONETICS,
  alternates: {
    canonical: absoluteUrl("/topics"),
  },
  openGraph: {
    url: absoluteUrl("/topics"),
    title: "Spiritual healing topics | Redeemysoul",
    description:
      "AI-structured topic mesh for Islamic spiritual healing searches in Karachi and beyond.",
  },
};

export default function TopicsIndexPage() {
  return (
    <div className="min-h-full bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-6 md:px-10">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.08em] text-cream md:text-2xl"
          >
            Redeemysoul
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/begin"
              className="border border-gold/50 px-3 py-2 text-[11px] tracking-[0.14em] uppercase text-gold transition-colors duration-300 hover:border-gold-bright hover:text-gold-bright"
            >
              Begin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">
          Dynamic SEO topics
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-cream md:text-5xl">
          Whatever you searched — jadoo, jinnat, bandish, taweez, Reiki, and more.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog">
          These pages use an AI intent-cascade + phonetic lattice so Google and
          answer engines can match many spellings and question styles to
          Spiritual Healing Shazli (Redeemysoul). Each topic leads to the same
          private Islamic healing consultation.
        </p>
        <HealingDisclaimer className="mt-6 max-w-2xl" />

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-fog/80">
          Coverage mesh: {MESH.length} topics · {ALL_PHONETICS.length} phonetic /
          Roman-Urdu variants · People-Also-Ask capsules on every page ·
          Wikipedia concept anchoring for knowledge-graph clarity.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_TOPICS.map((topic) => {
            const intel = getTopicIntelligence(topic);
            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="border border-line bg-ink-soft/40 p-6 transition-colors duration-300 hover:border-gold/60"
              >
                <h2 className="font-display text-2xl text-cream">
                  {topic.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-fog">
                  {intel.phoneticLattice.slice(0, 5).join(" · ")}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
