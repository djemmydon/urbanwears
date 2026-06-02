import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import FeaturedCollection from "@/components/sections/FeaturedCollection";
import TodaysOffers from "@/components/sections/TodaysOffers";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
    return (
        <main>
            <HeroSection />
            <CategoriesSection />
            <FeaturedCollection />
            <TodaysOffers />
            <NewsletterSection />
        </main>
    );
}
