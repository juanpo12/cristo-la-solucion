import GivingSection from "@/components/giving-section";
import { Groups } from "@/components/groups";
import { Hero } from "@/components/hero";
import { Meetings } from "@/components/meetings";
import { Prayer } from "@/components/prayer";
import { StoreShowcase } from "@/components/store-showcase";
import { Vision } from "@/components/vision";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Vision />
      <Groups />
      <Meetings />
      <StoreShowcase />
      <Prayer />
      <GivingSection />
    </div>
  );
}