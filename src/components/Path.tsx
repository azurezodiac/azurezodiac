const steps = [
  {
    title: "Listen",
    copy: "Share what you are carrying — symptoms, dreams, history, and the questions that will not leave.",
  },
  {
    title: "Discern",
    copy: "We separate spiritual strain from ordinary hardship with care, so the next step is honest.",
  },
  {
    title: "Restore",
    copy: "A guided path of dua, remembrance, and practical rhythm — paced to your life, not a script.",
  },
];

export function Path() {
  return (
    <section id="path" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            The path
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            Three movements. One intention.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-fog">
            Modern in craft. Classical in spirit. Built to feel calm on every
            screen.
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
