import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Target, Heart, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Expert Guidance',
    description: 'Learn from a seasoned educator with over a decade of experience in transforming lives through language.',
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Whether it\'s acing interviews, competitive exams, or daily communication — we tailor our approach to your goals.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Small batch sizes ensure individual attention and customized learning paths for maximum growth.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative Methods',
    description: 'Interactive sessions, real-world practice, and modern techniques make learning engaging and effective.',
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for various elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
          style={{ filter: 'brightness(1.1)' }}
        >
          <source src="/videos/about-bg-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Background decoration with parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent z-[1]" 
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Quote and Badge */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-lg mx-auto text-center">
              {/* Quote */}
              <div className="mb-6">
                <p className="font-display text-2xl md:text-3xl italic text-primary">
                  "Every student has a voice. I help them find it."
                </p>
              </div>

              {/* Online & Offline badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center"
              >
                <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg font-semibold text-base">
                  Online & Offline
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content with parallax */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">About Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Your Journey to
              <span className="block text-primary">Fluent English</span>
              Starts Here
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Based in the heart of Mumbai, our academy is dedicated to transforming the way you communicate. 
              We believe everyone deserves the confidence to express themselves clearly and effectively in English.
            </p>

            <p className="text-muted-foreground mb-10 leading-relaxed">
              From young students preparing for their future to professionals climbing the corporate ladder, 
              from teachers seeking to enhance their skills to competitive exam aspirants — our doors are 
              open to all who wish to master the art of spoken English.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}