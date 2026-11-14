import { About } from "@/components/About";
import { Atmosphere } from "@/components/Atmosphere";
import { Contact } from "@/components/Contact";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Hours } from "@/components/Hours";
import { Path } from "@/components/Path";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Testimonials } from "@/components/Testimonials";
import { Trust } from "@/components/Trust";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Services />
        <Atmosphere />
        <Path />
        <Trust />
        <Testimonials />
        <About />
        <Hours />
        <Faq />
        <Disclaimer />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
