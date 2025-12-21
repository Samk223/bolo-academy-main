/**
 * API Service Layer
 * Centralized API calls for the English Academy application
 * Works with the local Node.js backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export interface TimeSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BookingRequest {
  name: string;
  phone: string;
  email: string;
  course: string;
  message?: string;
  slotId: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: {
    id: string;
    name: string;
    email: string;
    course: string;
    slot_date: string;
    start_time: string;
    end_time: string;
  };
}

export interface TestAnswer {
  questionId: number;
  question: string;
  answer: string;
  type: 'written' | 'listening';
}

export interface TestEvaluationResponse {
  success: boolean;
  attemptId: string;
  score: number;
  cefrLevel: string;
  recommendedCourse: string;
  evaluation: {
    scores: Array<{ questionId: number; score: number; feedback: string }>;
    strengths: string[];
    improvements: string[];
    summary: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// API Functions

/**
 * Fetch available time slots for booking
 */
export async function fetchSlots(): Promise<TimeSlot[]> {
  const response = await fetch(`${API_BASE_URL}/slots`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch available slots');
  }
  
  const data = await response.json();
  return data.slots;
}

/**
 * Create a new booking
 */
export async function createBooking(booking: BookingRequest): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create booking');
  }
  
  return data;
}

/**
 * Evaluate test answers using AI
 */
export async function evaluateTest(
  answers: TestAnswer[],
  testType: 'written' | 'listening',
  userName?: string,
  userEmail?: string
): Promise<TestEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers, testType, userName, userEmail }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to evaluate test');
  }
  
  return data;
}

/**
 * Generate listening audio using ElevenLabs TTS
 */
export async function generateListeningAudio(questionId: number): Promise<{
  audioContent: string;
  transcript: string;
}> {
  const response = await fetch(`${API_BASE_URL}/generate-listening-audio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questionId }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate audio');
  }
  
  return data;
}

/**
 * Stream chat with Laila AI assistant
 */
export async function streamChat({
  messages,
  language = 'en',
  userName,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  language?: string;
  userName?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
}): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/laila-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, language, userName }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Chat request failed');
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onDelta(content);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }

    onDone();
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{
  status: string;
  env: {
    ai_provider: string;
    has_ai_key: boolean;
    has_elevenlabs: boolean;
    has_database: boolean;
  };
}> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
