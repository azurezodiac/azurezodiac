import Link from "next/link";

export function Contact() {
  return (
    <section id="contact" className="bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">Begin</p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-cream md:text-5xl">
          Ready for a quieter next step?
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-fog">
          Start with what you are facing. You will get a unique tracking number,
          and duplicate requests stay locked until admin clears them.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/begin"
            className="inline-flex bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            Begin healing
          </Link>
          <Link
            href="/track"
            className="inline-flex border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            Track request
          </Link>
        </div>
      </div>
    </section>
  );
}
