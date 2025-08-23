// import { Contact } from "@/components/contact";
import GivingSection from "@/components/giving-section";
import { Groups } from "@/components/groups";
import { Hero } from "@/components/hero";
import { Meetings } from "@/components/meetings";
import { Prayer } from "@/components/prayer";
import { StoreShowcase } from "@/components/store-showcase";
import { Vision } from "@/components/vision";
// import { YouTubeSection } from "@/components/youtube-section";

export default function Home() {
  return (
     <div className="min-h-screen">
      <Hero />
      <Vision />
      <Groups />
      <Meetings />
      <StoreShowcase />
      {/* <YouTubeSection /> */}
      <Prayer/>
      <GivingSection/>
      {/* <Contact /> */}
    </div>
  );
}
