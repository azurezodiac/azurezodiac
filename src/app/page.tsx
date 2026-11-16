import type { Metadata } from "next";
import { About } from "@/components/About";
import { Atmosphere } from "@/components/Atmosphere";
import { Contact } from "@/components/Contact";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Hours } from "@/components/Hours";
import { Learn } from "@/components/Learn";
import { Location } from "@/components/Location";
import { MobileStickyBegin } from "@/components/MobileStickyBegin";
import { Path } from "@/components/Path";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Testimonials } from "@/components/Testimonials";
import { Trust } from "@/components/Trust";
import { TrustMarquee } from "@/components/TrustMarquee";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  absoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    url: absoluteUrl("/"),
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustMarquee />
        <Services />
        <Atmosphere />
        <Path />
        <Learn />
        <Trust />
        <Testimonials />
        <About />
        <Hours />
        <Location />
        <Faq />
        <Disclaimer />
        <Contact />
      </main>
      <SiteFooter />
      <MobileStickyBegin />
    </>
  );
}
