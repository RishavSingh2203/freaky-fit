import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button'
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from 'react-hot-toast';


const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      
      // Get user details for toast and redirection
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Show success toast
      toast.success(`Welcome back, ${user.name || 'User'}!`);
      
      // Role-based redirection
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'TRAINER') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center w-screen h-screen">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Choose your sign in method</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <GoogleLoginButton />
          <div className="relative">
            <div className="flex absolute inset-0 items-center">
              <span className="w-full border-t" />
            </div>
            <div className="flex relative justify-center text-xs uppercase">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className="text-sm text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 