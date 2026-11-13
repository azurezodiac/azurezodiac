const steps = [
  {
    title: "Share",
    copy: "Tell us what you are carrying — sleep, dreams, family strain, fear, or the heaviness that will not lift.",
  },
  {
    title: "Understand",
    copy: "We listen carefully and separate spiritual concern from ordinary hardship, so guidance stays honest.",
  },
  {
    title: "Guide",
    copy: "You receive a clear next step through dua, ruqyah-centered practice, and a rhythm you can keep.",
  },
];

export function Path() {
  return (
    <section id="path" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            How it works
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            A simple path from worry to clarity.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            No public exposure. No pressure. Just a private consultation flow
            designed for trust.
          </p>
        </div>

        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="mb-6 h-px w-16 bg-gold" />
              <p className="text-xs tracking-[0.2em] uppercase text-fog">
                Step {index + 1}
              </p>
              <h3 className="mt-3 font-display text-3xl text-cream">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-fog">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
