import CTA from "./CTA/CTA";
import FAQ from "./FAQ/FAQ";
import Features from "./Upcoming_Events/Features";
import Hero from "./Hero";
import HowItWorks from "./How_It_Works/HowItWorks";
import ValueProposition from "./Value_Proposition/ValueProposition";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ValueProposition />
      <HowItWorks />
      <CTA />
      <FAQ />
    </>
  );
}
