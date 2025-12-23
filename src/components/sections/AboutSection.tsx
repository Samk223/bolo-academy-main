import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Target, Heart, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Expert Guidance',
    description:
      'Learn from a seasoned educator with over a decade of experience in transforming lives through language.',
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description:
      "Whether it's acing interviews, competitive exams, or daily communication — we tailor our approach to your goals.",
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description:
      'Small batch sizes ensure individual attention and customized learning paths for maximum growth.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative Methods',
    description:
      'Interactive sessions, real-world practice, and modern techniques make learning engaging and effective.',
  },
];

export default function AboutSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <>
      {/* QUOTE BETWEEN HERO & ABOUT */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 pt-6 md:pt-8 text-center"
      >
        <p className="font-display text-2xl md:text-4xl italic text-primary max-w-4xl mx-auto">
          “Every student has a voice. I help them find it.”
        </p>
      </motion.div>

      {/* ABOUT SECTION */}
      <section
        id="about"
        ref={sectionRef}
        className="relative overflow-hidden pt-10 pb-24 md:pb-32"
      >
        {/* LEFT SIDE VIDEO — HEIGHT MATCHES CONTENT */}
        <div className="absolute left-0 w-1/2 hidden lg:block overflow-hidden z-0 top-16 bottom-24">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-100 opacity-95"
          >
            <source src="/videos/about-bg-video.mp4" type="video/mp4" />
          </video>

          {/* Soft white overlay */}
          <div className="absolute inset-0 bg-white/20" />
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="lg:grid lg:grid-cols-2 gap-16">
            {/* Spacer for left video */}
            <div className="hidden lg:block" />

            {/* Content */}
            <motion.div
              style={{ y: contentY }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="flex flex-col lg:mt-16"
            >
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                About Us
              </span>

              <h2 className="font-display font-bold mt-4 mb-6">
                <span className="block text-foreground text-5xl md:text-6xl tracking-tight">
                  Your Journey to Fluent English
                </span>
                <span className="block text-primary text-3xl md:text-4xl mt-2">
                  Starts Here
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Based in Sangli, our academy is dedicated to transforming
                the way you communicate. We believe everyone deserves the confidence
                to express themselves clearly and effectively in English.
              </p>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                From young students preparing for their future to professionals
                climbing the corporate ladder, from teachers seeking to enhance their
                skills to competitive exam aspirants — our doors are open to all who
                wish to master the art of spoken English.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
