import AnnouncementBar from "@/components/layout/AnnouncementBar";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import TodaysOffers from "@/components/sections/TodaysOffers";
import TopProducts from "@/components/sections/TopProducts";
import TrendingProducts from "@/components/sections/TrendingProducts";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
    return (
        <main>
            <AnnouncementBar />
            <HeroSection />
            <CategoriesSection />
            <TodaysOffers />
            <TopProducts />
            <TrendingProducts />
            <NewsletterSection />
        </main>
    );
}
