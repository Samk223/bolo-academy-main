import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import CoursesSection from '@/components/sections/CoursesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import CTASection from '@/components/sections/CTASection';
import LailaChatbot from '@/components/chatbot/LailaChatbot';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <CoursesSection />
      <CTASection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <LailaChatbot />
    </main>
  );
};

export default Index;
