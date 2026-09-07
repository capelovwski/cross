import { FullPageScroll } from "@/components/scroll/FullPageScroll";
import { SectionNav } from "@/components/scroll/SectionNav";
import { Header } from "@/components/layout/Header";
import { sections } from "@/content/sections";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Who } from "@/components/sections/Who";
import { Tribe } from "@/components/sections/Tribe";
import { Events } from "@/components/sections/Events";
import { Calendar } from "@/components/sections/Calendar";
import { Photos } from "@/components/sections/Photos";
import { Faq } from "@/components/sections/Faq";
import { WhatsApp } from "@/components/sections/WhatsApp";
import { Footer } from "@/components/sections/Footer";

const ids = sections.map((s) => s.id);

export default function HomePage() {
  return (
    <FullPageScroll
      ids={ids}
      chrome={
        <>
          <Header variant="home" />
          <SectionNav />
        </>
      }
    >
      <Hero />
      <About />
      <Who />
      <Tribe tribe="up" />
      <Tribe tribe="go" />
      <Events />
      <Calendar />
      <Photos />
      <Faq />
      <WhatsApp />
      <Footer />
    </FullPageScroll>
  );
}
