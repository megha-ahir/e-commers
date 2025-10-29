import HeroBanner from '@/components/HeroBanner';
import TrendingProducts from '@/components/TrendingProducts';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="pt-16">
      <HeroBanner />
      <TrendingProducts />
      <Categories />
      <Footer />
    </div>
  );
}