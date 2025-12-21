import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Moon, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { streamChat as apiStreamChat, ChatMessage } from '@/services/api';

type Language = 'en' | 'hi';

export default function LailaChatbot() {
  const [isAwake, setIsAwake] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [userName, setUserName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const wakeUpLaila = () => {
    setIsAwake(true);
    setIsOpen(true);

    const greeting: ChatMessage = {
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं लैला हूं, आपकी इंग्लिश कोर्स एडवाइजर। मैं अभी जाग गई! आपका नाम क्या है?'
          : "Hello! I'm Laila, your English course advisor. I just woke up! What's your name?",
    };

    setMessages([greeting]);
  };

  const resetChat = () => {
    setMessages([]);
    setUserName('');
    setIsAwake(false);
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    toast({
      title: newLang === 'hi' ? 'भाषा बदली गई' : 'Language Changed',
      description: newLang === 'hi' ? 'अब हिंदी में बात करेंगे' : 'Now chatting in English',
    });
  };

  // ✅ ONLY LOCAL API STREAM (NO SUPABASE)
  const streamChat = async (userMessages: ChatMessage[]) => {
    setIsLoading(true);
    let assistantContent = '';

    try {
      await apiStreamChat({
        messages: userMessages,
        language,
        userName,
        onDelta: (content) => {
          assistantContent += content;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [...prev, { role: 'assistant', content: assistantContent }];
          });
        },
        onDone: () => {
          if (!userName && userMessages.length === 1) {
            const possibleName = userMessages[0].content.trim();
            if (
              possibleName.length < 30 &&
              (!possibleName.includes(' ') || possibleName.split(' ').length <= 3)
            ) {
              setUserName(possibleName);
            }
          }
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to get response',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');

    await streamChat(newMessages);
  };

  return (
    <>
      {/* Sleeping Laila */}
      <AnimatePresence>
        {!isAwake && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={wakeUpLaila}
            className="fixed bottom-6 right-6 z-50 group"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Moon className="w-8 h-8 text-primary-foreground" />
              </div>
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border rounded-lg px-3 py-1 text-xs shadow-md"
              >
                💤 Wake Laila
              </motion.div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isAwake && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] bg-background border rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between">
              <div>
                <h3 className="font-semibold">Laila</h3>
                <p className="text-xs opacity-80">Course Advisor</p>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleLanguage}><Globe className="w-4 h-4" /></button>
                <button onClick={resetChat}><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="Type your message..."
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
