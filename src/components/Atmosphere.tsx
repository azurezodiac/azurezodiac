import Image from "next/image";

export function Atmosphere() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="/images/stillness.jpg"
          alt="Mosque under soft evening light"
          fill
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,16,0.92)_0%,rgba(6,20,16,0.55)_55%,rgba(6,20,16,0.88)_100%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[28rem] max-w-7xl items-center px-6 py-24 md:px-10 md:py-28">
        <blockquote className="max-w-2xl">
          <p className="font-display text-3xl leading-snug text-cream md:text-5xl">
            “Healing begins where fear is met with remembrance — not with
            noise.”
          </p>
          <footer className="mt-8 text-sm tracking-[0.18em] uppercase text-gold">
            The Redeemysoul way
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
