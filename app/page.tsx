// import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import GivingSection from "@/components/giving-section";
import { Groups } from "@/components/groups";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Meetings } from "@/components/meetings";
import { Prayer } from "@/components/prayer";
import { StoreShowcase } from "@/components/store-showcase";
import { Vision } from "@/components/vision";

export default function Home() {
  return (
     <div className="min-h-screen">
      <Header />
      <Hero />
      <Vision />
      <Groups />
      <Meetings />
      <StoreShowcase />
      <Prayer/>
      <GivingSection/>
      {/* <Contact /> */}
      <Footer />
    </div>
  );
}
