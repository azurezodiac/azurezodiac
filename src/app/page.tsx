import { Atmosphere } from "@/components/Atmosphere";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Path } from "@/components/Path";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
