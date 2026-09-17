import { FullPageScroll } from "@/components/scroll/FullPageScroll";
import { SectionNav } from "@/components/scroll/SectionNav";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { StoriesBar } from "@/components/scroll/StoriesBar";
import { sections } from "@/content/sections";
import { Hero } from "@/components/sections/Hero";
import { Lema } from "@/components/sections/Lema";
import { Who } from "@/components/sections/Who";
import { Pgm } from "@/components/sections/Pgm";
import { Tribe } from "@/components/sections/Tribe";
import { Events } from "@/components/sections/Events";
import { Calendar } from "@/components/sections/Calendar";
import { Photos } from "@/components/sections/Photos";
import { Faq } from "@/components/sections/Faq";
import { FacaParte } from "@/components/sections/FacaParte";

const ids = sections.map((s) => s.id);

export default function HomePage() {
  return (
    <FullPageScroll
      ids={ids}
      chrome={
        <>
          <Header variant="home" />
          <SectionNav />
          <StoriesBar />
          <TabBar variant="home" />
        </>
      }
    >
      <Hero />
      <Lema />
      <Who />
      <Pgm />
      <Tribe tribe="up" />
      <Tribe tribe="go" />
      <Events />
      <Calendar />
      <Photos />
      <Faq />
      <FacaParte />
    </FullPageScroll>
  );
}
