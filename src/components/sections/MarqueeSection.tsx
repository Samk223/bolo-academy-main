import { motion } from 'framer-motion';

const words = [
  'CONFIDENCE',
  '•',
  'FLUENCY',
  '•',
  'SUCCESS',
  '•',
  'GROWTH',
  '•',
  'EXCELLENCE',
  '•',
  'COMMUNICATION',
  '•',
  'CONFIDENCE',
  '•',
  'FLUENCY',
  '•',
  'SUCCESS',
  '•',
  'GROWTH',
  '•',
  'EXCELLENCE',
  '•',
  'COMMUNICATION',
  '•',
];

export default function MarqueeSection() {
  return (
    <section className="py-8 bg-primary overflow-hidden">
      <div className="relative">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex whitespace-nowrap"
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground/90 mx-4 md:mx-6"
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
