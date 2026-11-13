const services = [
  {
    title: "Evil eye & envy",
    copy: "Calm, structured ruqyah-centered care for the weight of hasad and unsettled protection.",
  },
  {
    title: "Black magic concerns",
    copy: "Discernment-first support when fear feels larger than life — with clarity, dignity, and faith.",
  },
  {
    title: "Spiritual renewal",
    copy: "A quieter return to remembrance, dua, and daily rhythm when the heart feels distant.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            What we hold
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            Healing that stays close to the heart.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fog">
            No marketplace noise. No theatrical promises. Only careful listening
            and faith-led practice for those seeking relief and return.
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
