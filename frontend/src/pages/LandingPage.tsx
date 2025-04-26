import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Dumbbell, 
  Apple, 
  MessageCircle, 
  ChevronRight, 
  Users, 
  TrendingUp, 
  BarChart,
  ArrowRight
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const LandingPage = () => {
  // smooth scrolling behavior
  useEffect(() => {
    // smooth scrolling to anchor links
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash && link.hash.startsWith('#')) {
        e.preventDefault();
        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
          
          // Update URL hash without causing a jump
          history.pushState(null, '', link.hash);
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Using a custom gradient that works in both themes */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-primary/30 to-background text-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-10"></div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center h-full px-4 py-16 mx-auto text-center sm:px-6 sm:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <motion.h1 
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <span className="block text-primary">AI-Powered</span>
              <span className="block">Health & Fitness</span>
            </motion.h1>
            
            <motion.p 
              className="max-w-2xl mx-auto mt-6 text-xl text-muted-foreground sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Transform your fitness journey with personalized AI training, custom meal plans, and expert guidance.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90">
                  Get Started <ChevronRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-primary text-primary hover:bg-primary/10">
                  Log In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Fixed Arrow - positioned absolutely at the bottom of the section */}
        <motion.div 
          className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <a href="#features" className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md shadow-lg hover:bg-primary/30 transition-colors" aria-label="Scroll to features section">
              <ArrowRight className="w-6 h-6 rotate-90 text-primary" />
            </a>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container px-4 mx-auto sm:px-6">
          <motion.div 
            className="max-w-2xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Powered by AI, Built for You</h2>
            <p className="mt-4 text-xl text-muted-foreground">Our intelligent features adapt to your unique fitness journey</p>
          </motion.div>
          
          <motion.div 
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Brain className="w-10 h-10 text-primary" />,
                title: "AI Training Coach",
                description: "Personalized workout plans that adapt to your progress and goals"
              },
              {
                icon: <Apple className="w-10 h-10 text-primary" />,
                title: "Smart Meal Planning",
                description: "AI-generated meal plans tailored to your dietary needs and preferences"
              },
              {
                icon: <MessageCircle className="w-10 h-10 text-primary" />,
                title: "Fitness Chatbot",
                description: "24/7 AI assistant to answer your health and fitness questions"
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-primary" />,
                title: "Progress Tracking",
                description: "Advanced analytics to visualize and optimize your fitness journey"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full transition-all duration-200 border-none shadow-none hover:shadow-md hover:bg-muted/50">
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-primary/10 w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto sm:px-6">
          <motion.div 
            className="max-w-2xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How BodyMind AI Works ?</h2>
            <p className="mt-4 text-xl text-muted-foreground">Simple steps to transform your fitness journey</p>
          </motion.div>
          
          <Tabs defaultValue="analyze" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 h-14">
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="execute">Execute</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyze" className="mt-8">
              <motion.div 
                className="grid gap-8 md:grid-cols-2 md:gap-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1785&auto=format&fit=crop" 
                    alt="AI Analysis" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="text-2xl font-bold">AI-Powered Analysis</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes your fitness level, goals, and constraints to create a foundation for your personalized journey. The system learns from your feedback and adapts over time.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-primary" />
                      <span>Accurate fitness assessment</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      <span>Personalized goal setting</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="plan" className="mt-8">
              <motion.div 
                className="grid gap-8 md:grid-cols-2 md:gap-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1472&auto=format&fit=crop" 
                    alt="Workout Planning" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="text-2xl font-bold">Smart Planning</h3>
                  <p className="text-muted-foreground">
                    Get AI-generated workout and nutrition plans that fit your lifestyle and preferences. Our system creates balanced plans that maximize results while preventing burnout.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Dumbbell className="w-5 h-5 mr-2 text-primary" />
                      <span>Custom workout routines</span>
                    </li>
                    <li className="flex items-center">
                      <Apple className="w-5 h-5 mr-2 text-primary" />
                      <span>Personalized meal plans</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="execute" className="mt-8">
              <motion.div 
                className="grid gap-8 md:grid-cols-2 md:gap-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop" 
                    alt="Fitness Training" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="text-2xl font-bold">Guided Execution</h3>
                  <p className="text-muted-foreground">
                    Follow your personalized plan with step-by-step guidance. Our AI coach provides real-time feedback and adjusts your program as needed for optimal results.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      <span>Progress tracking</span>
                    </li>
                    <li className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                      <span>24/7 AI coaching</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* CTA Section - Using theme variables instead of hardcoded colors */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto sm:px-6">
          <motion.div 
            className="grid gap-8 lg:grid-cols-2 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Start Your Fitness Journey Today</h2>
              <p className="text-xl opacity-80">
                Join thousands who have transformed their lives with Freaky Fit's AI-powered fitness platform
              </p>
              <div className="flex flex-wrap gap-4 pt-3">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="User" 
                    className="object-cover w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Sarah J.</p>
                    <p className="text-sm opacity-80">Lost 30 pounds in 6 months</p>
                  </div>
                </div>
                <p className="mt-4">
                  "The AI coach understood my busy schedule and created a perfect workout plan. The meal suggestions were delicious and actually fit my lifestyle!"
                </p>
              </div>
              <div className="p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="User" 
                    className="object-cover w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Michael T.</p>
                    <p className="text-sm opacity-80">Gained 15 pounds of muscle</p>
                  </div>
                </div>
                <p className="mt-4">
                  "The personalized training programs adjust as I progress. It's like having a personal trainer but much more affordable!"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 