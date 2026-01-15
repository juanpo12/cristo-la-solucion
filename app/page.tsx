import { Hero } from "@/components/hero";
import { Vision } from "@/components/vision";
import dynamic from "next/dynamic";

const Groups = dynamic(() => import("@/components/groups").then((mod) => mod.Groups), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const Meetings = dynamic(() => import("@/components/meetings").then((mod) => mod.Meetings), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const StoreShowcase = dynamic(() => import("@/components/store-showcase").then((mod) => mod.StoreShowcase), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const Prayer = dynamic(() => import("@/components/prayer").then((mod) => mod.Prayer), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});
const GivingSection = dynamic(() => import("@/components/giving-section"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});

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