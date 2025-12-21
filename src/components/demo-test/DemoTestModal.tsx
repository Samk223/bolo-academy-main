import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  PenLine,
  Headphones,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Download,
  CheckCircle,
  Home,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import {
  generateListeningAudio,
  evaluateTest,
  TestAnswer,
} from '@/services/api';

interface DemoTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  type: 'easy' | 'medium' | 'hard' | 'descriptive';
  wordLimit?: number;
}

const writtenQuestions: Question[] = [
  { id: 1, question: 'What is your favorite hobby and why do you enjoy it?', type: 'easy', wordLimit: 50 },
  { id: 2, question: 'Describe the most memorable trip you have ever taken. What made it special?', type: 'medium', wordLimit: 100 },
  { id: 3, question: 'Do you think technology has made our lives better or worse? Give reasons for your answer.', type: 'hard', wordLimit: 150 },
  { id: 4, question: 'Write about a challenge you faced in life and how you overcame it. What lessons did you learn?', type: 'descriptive', wordLimit: 200 },
];

const listeningQuestions: Question[] = [
  { id: 1, question: 'What does the speaker tell you about themselves?', type: 'easy' },
  { id: 2, question: "Describe the speaker's daily morning routine.", type: 'medium' },
  { id: 3, question: 'What reasons does the speaker give for learning English?', type: 'hard' },
  { id: 4, question: 'Summarize the speaker’s weekend visit and what they did.', type: 'descriptive' },
];

type TestType = 'written' | 'listening' | null;
type TestPhase = 'select' | 'test' | 'evaluating' | 'results';

interface TestResults {
  scorePercentage: number;
  cefrLevel: string;
  recommendedCourse: string;
  evaluation: {
    evaluations: Array<{
      questionId: number;
      grammar: number;
      vocabulary: number;
      coherence: number;
      fluency: number;
      feedback: string;
    }>;
    overallFeedback: string;
    strengths: string[];
    areasToImprove: string[];
  };
  answers: TestAnswer[];
}

export default function DemoTestModal({ isOpen, onClose }: DemoTestModalProps) {
  const { toast } = useToast();

  const [testType, setTestType] = useState<TestType>(null);
  const [phase, setPhase] = useState<TestPhase>('select');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<TestResults | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({});
  const [audioLoading, setAudioLoading] = useState(false);

  const questions = testType === 'written' ? writtenQuestions : listeningQuestions;

  // 🎧 Generate audio (Local API)
  const generateAudio = useCallback(async (questionId: number) => {
    if (audioUrls[questionId]) return;

    setAudioLoading(true);
    try {
      const data = await generateListeningAudio(questionId);
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      setAudioUrls(prev => ({ ...prev, [questionId]: audioUrl }));
    } catch (error) {
      toast({
        title: 'Audio Error',
        description: 'Could not load audio.',
        variant: 'destructive',
      });
    } finally {
      setAudioLoading(false);
    }
  }, [audioUrls, toast]);

  useEffect(() => {
    if (testType === 'listening' && phase === 'test') {
      const id = listeningQuestions[currentQuestion]?.id;
      if (id) generateAudio(id);
    }
  }, [testType, phase, currentQuestion, generateAudio]);

  const handleSubmit = async () => {
    setPhase('evaluating');

    const formattedAnswers: TestAnswer[] = questions.map(q => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || '',
      type: testType!,
    }));

    try {
      const data = await evaluateTest(formattedAnswers, testType!);

      setResults({
        scorePercentage: data.score,
        cefrLevel: data.cefrLevel,
        recommendedCourse: data.recommendedCourse,
        evaluation: {
          evaluations: data.evaluation.scores.map(s => ({
            questionId: s.questionId,
            grammar: s.score,
            vocabulary: s.score,
            coherence: s.score,
            fluency: s.score,
            feedback: s.feedback,
          })),
          overallFeedback: data.evaluation.summary,
          strengths: data.evaluation.strengths,
          areasToImprove: data.evaluation.improvements,
        },
        answers: formattedAnswers,
      });

      setPhase('results');
    } catch (error: any) {
      toast({
        title: 'Evaluation Failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
      setPhase('test');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* UI UNCHANGED */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
