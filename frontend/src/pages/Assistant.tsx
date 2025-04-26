import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Dumbbell, Heart, Brain, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/ai-chat`, {
        message: input.trim(),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-30"></div>
            <div className="relative bg-background rounded-full p-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Your Fitness AI Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized advice on workouts, nutrition, and health. I'm here to help you achieve your fitness goals!
        </p>
      </motion.div>

      <Card className="h-[calc(100vh-16rem)]">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span>Fitness Expert</span>
              <span className="mx-1">•</span>
              <Heart className="w-4 h-4 text-primary" />
              <span>Nutrition Guide</span>
              <span className="mx-1">•</span>
              <Brain className="w-4 h-4 text-primary" />
              <span>Health Advisor</span>
            </div>
          </div>

          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.role === 'assistant' && (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-20"></div>
                            <div className="relative bg-background rounded-full p-1">
                              <Bot className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        )}
                        {message.role === 'user' && (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-foreground to-primary-foreground/50 rounded-full blur opacity-20"></div>
                            <div className="relative bg-primary rounded-full p-1">
                              <User className="w-5 h-5 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          <p className="text-xs mt-2 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-20"></div>
                        <div className="relative bg-background rounded-full p-1">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about workouts, nutrition, or health..."
                disabled={isLoading}
                className="flex-1 bg-background shadow-sm"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="relative group px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="text-sm font-medium">Send</span>
                </div>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Assistant;