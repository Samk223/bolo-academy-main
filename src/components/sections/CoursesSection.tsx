import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Briefcase, GraduationCap, Users, Video, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const courses = [
  {
    icon: Users,
    title: 'Basic Boost Plan',
    price: '₹2,999 / month',
    description:
      'Start speaking English confidently from Day 1 in a small group setting.',
    features: [
      'Daily 60-minute live group class (5–7 students)',
      'Sentence building & basic grammar',
      'Confidence drills & speaking games',
      'Open mic, interviews & daily activities',
      'Weekly instructor feedback',
    ],
    popular: false,
  },
  {
    icon: MessageCircle,
    title: 'Speaker Combo Plan',
    price: '₹4,999 / month',
    description:
      'Group learning with personal attention for faster improvement.',
    features: [
      'Everything in Basic Boost Plan',
      'Weekly 1-on-1 session (30 mins)',
      'Personalized error correction',
      'Confidence coaching',
      'Fluency improvement tracking',
    ],
    popular: false,
  },
  {
    icon: Briefcase,
    title: 'Fluency Fast-Track Plan',
    price: '₹9,999 / month',
    description:
      'Your personal English trainer — every day.',
    features: [
      'Daily 60-minute 1-on-1 live sessions',
      'Customized grammar & speaking practice',
      'Roleplays, mock calls & activities',
      'Daily feedback & improvement plan',
      'Interview & workplace English',
    ],
    popular: true, // MOST POPULAR
  },
  {
    icon: GraduationCap,
    title: 'Gold Master Plan',
    price: '₹14,999 / month',
    description:
      'Our most premium English transformation program.',
    features: [
      'Daily 1-on-1 live sessions (60 mins)',
      'Optional group activities access',
      'Daily voice-note corrections',
      'Weekly video feedback',
      '24/7 doubt-clearing support',
      'Mock interviews & roleplay drills',
    ],
    popular: false,
  },
];


const deliveryModes = [
  {
    icon: Video,
    title: 'Live Online Classes',
    description:
      'Daily live classes via Google Meet & Zoom with expert instructor guidance.',
  },
  {
    icon: MessageCircle,
    title: 'Personalized 1-on-1 Training',
    description:
      'Dedicated personal sessions for fast confidence and fluency improvement.',
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
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            1-Month Spoken English Master Programs
          </span>
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
              <Card
                className={`h-full flex flex-col transition-all duration-300 hover:shadow-card hover:-translate-y-2 ${course.popular ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
              >
                {course.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 text-center rounded-t-xl">
                    MOST POPULAR
                  </div>
                )}

                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <course.icon className="w-7 h-7 text-primary" />
                  </div>

                  <CardTitle className="text-xl">{course.title}</CardTitle>

                  <p className="text-2xl font-bold text-primary mt-2">
                    {course.price}
                  </p>

                  <CardDescription className="mt-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3">
                    {course.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    className="w-full mt-auto py-3 group"
                    asChild
                  >
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
