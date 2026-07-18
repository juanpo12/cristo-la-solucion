import { Hero } from "@/components/hero";
import { Vision } from "@/components/vision";
import { ResourcesSection } from "@/components/resources-section";
import dynamic from "next/dynamic";

// Revalidar cada 5 minutos para que los recursos nuevos aparezcan en la home
export const revalidate = 300;

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
const Volunteering = dynamic(() => import("@/components/volunteering").then((mod) => mod.Volunteering), {
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
      <ResourcesSection />
      <Prayer />
      <Volunteering />
      <GivingSection />
    </div>
  );
}