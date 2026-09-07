import { HeroTeardown } from "@/components/hero/hero-teardown";
import { ChipSection } from "@/components/sections/chip-section";
import { VisionSection } from "@/components/sections/vision-section";
import { AcquireSection } from "@/components/sections/acquire-section";
import { Marquee } from "@/components/sections/marquee";
import { Footer } from "@/components/sections/footer";

/**
 * Homepage — entirely the iPhone 18, with the rest of the catalog appearing
 * only as the marquee teaser at the bottom (docs/DESIGN_SYSTEM.md §7.1).
 */
export default function Home() {
  return (
    <>
      <HeroTeardown />
      <ChipSection />
      <VisionSection />
      <AcquireSection />
      <Marquee />
      <Footer />
    </>
  );
}
