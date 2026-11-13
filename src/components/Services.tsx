const services = [
  {
    title: "Nazar & hasad",
    copy: "For sudden heaviness, unexplained fear, or the sense that envy has settled on your home, work, or children — with calm ruqyah-centered care.",
  },
  {
    title: "Sihr & dark disturbance",
    copy: "When dreams, pressure, or household strain feel beyond ordinary hardship, we begin with discernment, dignity, and faith — never fear spectacle.",
  },
  {
    title: "Spiritual renewal",
    copy: "For a heart that feels distant from salah, dua, and inner quiet. A paced return to remembrance and daily rhythm that fits real life.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            Services
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            Care that listens before it speaks.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fog">
            Redeemysoul serves seekers who want Islamic healing without noise,
            shortcuts, or public display. Every consultation stays private.
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="group grid gap-3 py-8 transition-colors duration-300 md:grid-cols-[4rem_1fr] md:gap-8"
            >
              <span className="font-display text-2xl text-gold/70 transition-colors duration-300 group-hover:text-gold-bright">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl text-cream md:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-fog">
                  {service.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
