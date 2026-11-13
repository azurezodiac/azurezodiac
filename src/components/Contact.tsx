import Link from "next/link";

export function Contact() {
  return (
    <section id="contact" className="bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <p className="text-xs tracking-[0.22em] uppercase text-gold">Begin</p>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-cream md:text-5xl">
          Ready to share what you are carrying?
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-fog">
          Start a private consultation request. Your details become a ready
          WhatsApp or email message — so guidance can begin with clarity and
          respect.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/begin"
            className="inline-flex bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            Begin healing
          </Link>
          <a
            href="https://wa.me/923452845400"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex border border-mist/25 px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-mist transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            WhatsApp directly
          </a>
        </div>
      </div>
    </section>
  );
}
