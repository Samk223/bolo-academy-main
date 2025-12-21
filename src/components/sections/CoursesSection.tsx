import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Briefcase, GraduationCap, Users, Video, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const courses = [
  {
    icon: Users,
    title: 'Student Foundation',
    description: 'Perfect for school and college students looking to build a strong foundation in spoken English.',
    features: ['Basic to advanced vocabulary', 'Grammar fundamentals', 'Pronunciation practice', 'Group discussions'],
    popular: false,
  },
  {
    icon: Briefcase,
    title: 'Professional Excellence',
    description: 'Tailored for working professionals aiming to excel in business communication.',
    features: ['Corporate vocabulary', 'Presentation skills', 'Email writing', 'Interview preparation'],
    popular: true,
  },
  {
    icon: GraduationCap,
    title: 'Competitive Edge',
    description: 'Specialized training for competitive exam aspirants focusing on English proficiency.',
    features: ['Exam-specific strategies', 'Reading comprehension', 'Verbal ability', 'Mock tests'],
    popular: false,
  },
  {
    icon: BookOpen,
    title: 'Teacher Training',
    description: 'Enhance your teaching methodology and English communication skills.',
    features: ['Advanced grammar', 'Teaching techniques', 'Classroom English', 'Confidence building'],
    popular: false,
  },
];

const deliveryModes = [
  {
    icon: Video,
    title: 'Live Online Classes',
    description: 'Interactive sessions via Google Meet & Zoom from the comfort of your home.',
  },
  {
    icon: MessageCircle,
    title: 'In-Person Training',
    description: 'One-on-one sessions in Mumbai for personalized attention and faster results.',
  },
];

export default function CoursesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="courses" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Our Programs</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Courses Designed for
            <span className="text-primary"> Your Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a student, professional, teacher, or exam aspirant — we have the perfect program 
            to help you achieve fluency and confidence in spoken English.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className={`h-full transition-all duration-300 hover:shadow-card hover:-translate-y-2 ${
                course.popular ? 'border-primary ring-2 ring-primary/20' : ''
              }`}>
                {course.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 text-center">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <course.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-6 group" asChild>
                    <a href="#contact">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Delivery Modes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-secondary/50 rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Learn Your Way
            </h3>
            <p className="text-muted-foreground">
              Choose the learning mode that fits your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {deliveryModes.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-vintage"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <mode.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-foreground mb-2">{mode.title}</h4>
                  <p className="text-muted-foreground">{mode.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
