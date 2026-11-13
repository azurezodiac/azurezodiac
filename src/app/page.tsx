import { Atmosphere } from "@/components/Atmosphere";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Path } from "@/components/Path";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Services />
        <Atmosphere />
        <Path />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
