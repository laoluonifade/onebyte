import { Cta, Faq, Footer } from "./components/Closing";
import { Developers } from "./components/Developers";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Intro } from "./components/Intro";
import { Nav } from "./components/Nav";
import { Pricing } from "./components/Pricing";
import { Problem } from "./components/Problem";
import { Control, Products } from "./components/Products";

export default function App() {
  return (
    <>
      <Intro />
      <Nav />
      <main className="intro:**:[animation-play-state:paused]">
        <Hero />
        <Problem />
        <HowItWorks />
        <Products />
        <Control />
        <Pricing />
        <Developers />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
