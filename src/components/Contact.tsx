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
          Start with what you are facing. Then share your name, your
          mother&apos;s name, and your closest location — we will open a ready
          WhatsApp or email message for you.
        </p>
        <Link
          href="/begin"
          className="mt-10 inline-flex bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
        >
          Begin healing
        </Link>
      </div>
    </section>
  );
}
