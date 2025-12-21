import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, TCS',
    content: 'The professional excellence course transformed my career. I now lead client meetings with confidence and clarity. The personalized attention made all the difference!',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'MBA Aspirant',
    content: 'The competitive edge program helped me crack my CAT verbal section. The exam strategies and mock tests were exactly what I needed. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Sneha Patil',
    role: 'School Teacher',
    content: 'As a teacher, I wanted to improve my classroom communication. This course gave me the tools and confidence to engage my students better. Thank you!',
    rating: 5,
  },
  {
    name: 'Arjun Desai',
    role: 'College Student',
    content: 'From being hesitant to speak in group discussions to now presenting at college events — this journey has been incredible. The supportive environment helped me grow.',
    rating: 5,
  },
  {
    name: 'Kavitha Iyer',
    role: 'HR Manager, Wipro',
    content: 'The online classes fit perfectly into my busy schedule. The quality of teaching is exceptional, and I\'ve seen remarkable improvement in just 3 months.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary-foreground rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary-foreground/70 font-semibold tracking-wider uppercase text-sm">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 mb-6">
            Stories of
            <span className="font-display italic font-medium"> Success</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Hear from our students who have transformed their communication skills and achieved their goals.
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-card relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Quote className="w-6 h-6 text-accent-foreground" />
            </div>

            {/* Content */}
            <div className="pt-4">
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-display"
              >
                "{testimonials[activeIndex].content}"
              </motion.p>

              {/* Author */}
              <motion.div
                key={`author-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-lg text-foreground">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-muted-foreground">{testimonials[activeIndex].role}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-primary w-6'
                      : 'bg-border hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
