import Blogs from "@/components/home/sections/blogs";
import Capabilities from "@/components/home/sections/capabilities";
import Features from "@/components/home/sections/features";
import Footer from "@/components/home/sections/footer";
import GetObk from "@/components/home/sections/get-obk";
import Hero from "@/components/home/sections/hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <GetObk />
      <Capabilities />
      <Blogs />
      <Footer />
    </>
  );
}
