import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Welcome to Freaky Fit.');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex overflow-hidden justify-center items-center px-4 py-12 min-h-screen bg-background sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">BodyMind AI</h1>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-center text-foreground">
            Create your account
          </h2>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="p-4 mb-6 bg-destructive/10 rounded-md">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>

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
                  autoComplete="new-password"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>

            <div className="text-sm text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register; 