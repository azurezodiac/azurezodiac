export function Contact() {
  return (
    <section id="contact" className="bg-ink-soft">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-32">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">
            Begin
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-cream md:text-5xl">
            Ready for a quieter next step?
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-fog">
            Tell us briefly what you are facing. We reply with guidance on how a
            consultation can begin — privately and with respect.
          </p>
        </div>

        <form
          className="space-y-5"
          action="mailto:hello@redeemysoul.com"
          method="post"
          encType="text/plain"
        >
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
              Name
            </span>
            <input
              name="name"
              required
              className="w-full border border-line bg-ink/60 px-4 py-3 text-cream outline-none transition-colors duration-300 placeholder:text-fog/50 focus:border-gold"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-line bg-ink/60 px-4 py-3 text-cream outline-none transition-colors duration-300 placeholder:text-fog/50 focus:border-gold"
              placeholder="you@email.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-fog">
              What are you carrying?
            </span>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full resize-y border border-line bg-ink/60 px-4 py-3 text-cream outline-none transition-colors duration-300 placeholder:text-fog/50 focus:border-gold"
              placeholder="A few honest lines are enough."
            />
          </label>
          <button
            type="submit"
            className="bg-gold px-7 py-3.5 text-sm tracking-[0.14em] uppercase text-ink transition-colors duration-300 hover:bg-gold-bright"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
