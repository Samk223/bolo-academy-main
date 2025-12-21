import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Users, Award, Clock, BookOpen, GraduationCap, Pencil, Globe, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DemoTestModal from '@/components/demo-test/DemoTestModal';

const stats = [{
  icon: Users,
  value: '500+',
  label: 'Students Trained'
}, {
  icon: Award,
  value: '10+',
  label: 'Years Experience'
}, {
  icon: Clock,
  value: '24/7',
  label: 'Online Support'
}];

// Floating educational elements
const floatingElements = [
  { Icon: BookOpen, x: '8%', y: '20%', size: 48, delay: 0, duration: 4, color: 'text-primary' },
  { Icon: GraduationCap, x: '85%', y: '15%', size: 56, delay: 0.5, duration: 5, color: 'text-accent' },
  { Icon: Pencil, x: '12%', y: '65%', size: 36, delay: 1, duration: 4.5, color: 'text-primary/70' },
  { Icon: Globe, x: '88%', y: '55%', size: 44, delay: 1.5, duration: 5.5, color: 'text-accent' },
  { Icon: MessageCircle, x: '5%', y: '45%', size: 40, delay: 2, duration: 4, color: 'text-primary/80' },
  { Icon: Star, x: '92%', y: '35%', size: 32, delay: 0.8, duration: 3.5, color: 'text-accent/80' },
  { Icon: BookOpen, x: '75%', y: '70%', size: 38, delay: 1.2, duration: 4.8, color: 'text-primary/60' },
  { Icon: Star, x: '18%', y: '35%', size: 28, delay: 2.5, duration: 3, color: 'text-accent/70' },
];

export default function HeroSection() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  return <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-primary/10">
      {/* Background texture */}
      <div className="absolute inset-0 vintage-texture pointer-events-none" />
      
      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Floating 3D Educational Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} drop-shadow-lg pointer-events-none z-10`}
          style={{ left: element.x, top: element.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: 1,
            y: [0, -25, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            opacity: { duration: element.duration, repeat: Infinity, ease: "easeInOut" },
            y: { duration: element.duration, repeat: Infinity, ease: "easeInOut", delay: element.delay },
            rotate: { duration: element.duration * 1.5, repeat: Infinity, ease: "easeInOut", delay: element.delay },
            scale: { duration: 0.5, delay: element.delay }
          }}
        >
          <element.Icon size={element.size} strokeWidth={1.5} />
        </motion.div>
      ))}
      
      {/* Mountain/Hills Wave Background - Vintage Blue Theme */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Back mountain layer - Deep navy */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '180px' }}>
          <path fill="hsl(215, 70%, 25%)" fillOpacity="0.6" d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,165.3C960,149,1056,139,1152,154.7C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        {/* Middle layer - Primary blue */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '140px' }}>
          <path fill="hsl(215, 65%, 35%)" fillOpacity="0.7" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,197.3C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
        {/* Front layer - Lighter blue with gold tint */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '100px' }}>
          <path fill="hsl(215, 60%, 45%)" fillOpacity="0.8" d="M0,288L48,277.3C96,267,192,245,288,250.7C384,256,480,288,576,282.7C672,277,768,235,864,224C960,213,1056,235,1152,245.3C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-20 pb-32 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="text-center lg:text-left">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Mumbai's Premier English Academy</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
              <span className="block">SPEAK</span>
              <span className="block text-primary">ENGLISH</span>
              <span className="block font-display italic font-medium text-4xl md:text-5xl lg:text-6xl text-muted-foreground">
                with Confidence
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Transform your communication skills with personalized spoken English coaching. 
              From students to professionals — unlock your potential with our proven methodology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="text-lg px-8" onClick={() => setIsTestModalOpen(true)}>
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="#courses">Explore Courses</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.4 + index * 0.1
            }} className="text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>)}
            </div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div 
            initial={{
              opacity: 0,
              scale: 0.8
            }} 
            animate={{
              opacity: 1,
              scale: 1
            }} 
            transition={{
              duration: 1,
              delay: 0.4
            }} 
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating animation wrapper */}
              <motion.div animate={{
              y: [0, -20, 0]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }} className="relative z-10">
                <img alt="English teacher ready to help you learn" className="w-full h-full object-contain drop-shadow-2xl" src="https://images.prismic.io/localstudio/0cad7d87-d3b0-40d4-bd12-89e4e9012355_thibaud.png?auto=format,compress" />
              </motion.div>
              
              {/* Glow effect behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10 scale-75" />
              
              {/* Decorative rings */}
              <motion.div animate={{
              rotate: 360
            }} transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }} className="absolute inset-0 border-2 border-primary/10 rounded-full -z-5" />
              <motion.div animate={{
              rotate: -360
            }} transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }} className="absolute inset-4 border border-accent/20 rounded-full -z-5" />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.5
      }} className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 scroll-indicator" />
          </a>
        </motion.div>
      </div>

      {/* Demo Test Modal */}
      <DemoTestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />
    </section>;
}