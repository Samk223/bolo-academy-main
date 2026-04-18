import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenLine, Headphones, ArrowRight, ArrowLeft, Loader2, Download, CheckCircle, Home, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateListeningAudio, evaluateTest } from '@/services/api';


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
  { id: 1, question: "What is your favorite hobby?", type: 'easy', wordLimit: 50 },
  { id: 2, question: "If you had to chose between money and knowledge what would you chose and why?", type: 'medium', wordLimit: 100 },
  { id: 3, question: "Are you an introvert, an extrovert or an ambivert ?", type: 'hard', wordLimit: 150 },
  { id: 4, question: "What is your favourite food ?", type: 'descriptive', wordLimit: 200 },
];

const listeningQuestions: Question[] = [
  { id: 1, question: "Was the speaker friendly?", type: 'easy' },
  { id: 2, question: "Describe the speaker's daily morning routine.", type: 'medium' },
  { id: 3, question: "Does the speaker love learning English?", type: 'hard' },
  { id: 4, question: "Was the speaker's weekend plan interesting?", type: 'descriptive' },
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
  answers: Array<{
    questionId: number;
    question: string;
    answer: string;
    type: string;
  }>;
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

  // Generate audio for listening test questions
const generateAudio = useCallback(async (questionId: number) => {
  if (audioUrls[questionId]) return;

  setAudioLoading(true);
  try {
    const data = await generateListeningAudio(questionId);

    const byteCharacters = atob(data.audioContent);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const audioBlob = new Blob([new Uint8Array(byteNumbers)], {
      type: "audio/mpeg",
    });

    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrls(prev => ({ ...prev, [questionId]: audioUrl }));

  } catch (error) {
    toast({
      title: "Audio Error",
      description: "Could not load audio. Please try again.",
      variant: "destructive",
    });
  } finally {
    setAudioLoading(false);
  }
}, [audioUrls, toast]);


  // Load audio when question changes in listening test
  useEffect(() => {
    if (testType === 'listening' && phase === 'test') {
      const questionId = listeningQuestions[currentQuestion]?.id;
      if (questionId) {
        generateAudio(questionId);
      }
    }
  }, [testType, phase, currentQuestion, generateAudio]);

  const handleStartTest = (type: TestType) => {
    setTestType(type);
    setPhase('test');
    setCurrentQuestion(0);
    setAnswers({});
    setAudioUrls({});
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setPhase('evaluating');

    const formattedAnswers = questions.map(q => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || '',
      type: q.type,
    }));

    try {
      if (!testType) throw new Error('Test type is missing');
      
      const data = await evaluateTest(formattedAnswers as any, testType);

      setResults(data as any);
      setPhase('results');
    } catch (error: any) {
      console.error('Evaluation error:', error);
      toast({
        title: 'Evaluation Failed',
        description: error.message || 'Could not evaluate your test. Please try again.',
        variant: 'destructive',
      });
      setPhase('test');
    }
  };

  const handleDownloadPDF = () => {
    if (!results) return;

    // Generate PDF content as HTML
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>English Proficiency Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 10px; }
    h2 { color: #2d3748; margin-top: 30px; }
    .score-box { background: linear-gradient(135deg, #1a365d, #2d3748); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0; }
    .score { font-size: 48px; font-weight: bold; }
    .cefr { font-size: 24px; margin-top: 10px; color: #c9a227; }
    .section { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .feedback { border-left: 4px solid #c9a227; padding-left: 15px; margin: 10px 0; }
    .scores { display: flex; gap: 20px; flex-wrap: wrap; margin: 10px 0; }
    .score-item { background: #e2e8f0; padding: 10px 15px; border-radius: 5px; }
    ul { padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>English Proficiency Test Report</h1>
  <p>Test Type: ${testType?.charAt(0).toUpperCase()}${testType?.slice(1)} Test</p>
  <p>Date: ${new Date().toLocaleDateString()}</p>
  
  <div class="score-box">
    <div class="score">${results.scorePercentage}%</div>
    <div class="cefr">CEFR Level: ${results.cefrLevel}</div>
    <div style="margin-top: 10px;">Recommended Course: ${results.recommendedCourse}</div>
  </div>

  <h2>Overall Feedback</h2>
  <p>${results.evaluation.overallFeedback}</p>

  <h2>Strengths</h2>
  <ul>
    ${results.evaluation.strengths.map(s => `<li>${s}</li>`).join('')}
  </ul>

  <h2>Areas to Improve</h2>
  <ul>
    ${results.evaluation.areasToImprove.map(a => `<li>${a}</li>`).join('')}
  </ul>

  <h2>Detailed Evaluation</h2>
  ${results.answers.map((answer, i) => {
      const eval_ = results.evaluation.evaluations[i];
      return `
    <div class="section">
      <h3>Question ${i + 1}: ${answer.question}</h3>
      <p><strong>Your Answer:</strong> ${answer.answer || '(No answer provided)'}</p>
      <div class="scores">
        <span class="score-item">Grammar: ${eval_?.grammar || 0}%</span>
        <span class="score-item">Vocabulary: ${eval_?.vocabulary || 0}%</span>
        <span class="score-item">Coherence: ${eval_?.coherence || 0}%</span>
        <span class="score-item">Fluency: ${eval_?.fluency || 0}%</span>
      </div>
      <div class="feedback">${eval_?.feedback || 'No feedback available'}</div>
    </div>
    `;
    }).join('')}

  <p style="margin-top: 40px; text-align: center; color: #718096;">
    Generated by SpeakEnglish Academy
  </p>
</body>
</html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleClose = () => {
    setTestType(null);
    setPhase('select');
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {phase === 'select' && 'Check Your English Proficiency'}
              {phase === 'test' && `${testType === 'written' ? 'Written' : 'Listening'} Test`}
              {phase === 'evaluating' && 'Evaluating Your Answers...'}
              {phase === 'results' && 'Your Test Results'}
            </h2>
            <button onClick={handleClose} className="p-1 hover:bg-primary-foreground/20 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Test Type Selection */}
            {phase === 'select' && (
              <div className="space-y-6">
                <p className="text-muted-foreground text-center">
                  Choose your test type to begin the assessment
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartTest('written')}
                    className="p-6 border-2 border-input rounded-xl hover:border-primary transition-colors text-left group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                      <PenLine className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Written Test</h3>
                    <p className="text-sm text-muted-foreground">
                      4 questions ranging from easy to descriptive. Test your grammar, vocabulary, and writing skills.
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartTest('listening')}
                    className="p-6 border-2 border-input rounded-xl hover:border-primary transition-colors text-left group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                      <Headphones className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Listening Test</h3>
                    <p className="text-sm text-muted-foreground">
                      4 audio clips with questions. Test your comprehension and listening skills.
                    </p>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Test Questions */}
            {phase === 'test' && (
              <div className="space-y-6">
                {/* Progress */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {questions[currentQuestion].type}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Audio Player for Listening Test */}
                {testType === 'listening' && (
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Listen to the audio:
                    </p>
                    {audioLoading ? (
                      <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Generating audio...</span>
                      </div>
                    ) : audioUrls[questions[currentQuestion].id] ? (
                      <audio
                        key={questions[currentQuestion].id}
                        controls
                        className="w-full"
                        src={audioUrls[questions[currentQuestion].id]}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAudio(questions[currentQuestion].id)}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          Load Audio
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Question */}
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-4">
                    {questions[currentQuestion].question}
                  </h3>
                  {questions[currentQuestion].wordLimit && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Word limit: approximately {questions[currentQuestion].wordLimit} words
                    </p>
                  )}
                  <Textarea
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {(answers[questions[currentQuestion].id] || '').split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentQuestion < questions.length - 1 ? (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      Submit Test
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Evaluating State */}
            {phase === 'evaluating' && (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  AI is evaluating your answers...
                </h3>
                <p className="text-muted-foreground">
                  This may take a moment. Please wait.
                </p>
              </div>
            )}

            {/* Results */}
            {phase === 'results' && results && (
              <div className="space-y-6">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-6 text-center">
                  <p className="text-lg opacity-90 mb-2">Your Score</p>
                  <p className="text-5xl font-bold mb-2">{results.scorePercentage}%</p>
                  <div className="inline-block bg-primary-foreground/20 px-4 py-2 rounded-full">
                    <span className="font-semibold">CEFR Level: {results.cefrLevel}</span>
                  </div>
                </div>

                {/* Recommended Course */}
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Recommended Course</p>
                  <p className="font-semibold text-foreground text-lg">{results.recommendedCourse}</p>
                </div>

                {/* Overall Feedback */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Overall Feedback</h4>
                  <p className="text-muted-foreground">{results.evaluation.overallFeedback}</p>
                </div>

                {/* Strengths & Areas to Improve */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">Strengths</h5>
                    <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
                      {results.evaluation.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h5 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Areas to Improve</h5>
                    <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1">
                      {results.evaluation.areasToImprove.map((a, i) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={handleDownloadPDF} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button onClick={handleClose} className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
