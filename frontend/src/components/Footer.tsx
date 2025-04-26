import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DumbbellIcon, InstagramIcon, TwitterIcon, FacebookIcon, Github, Heart, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 mx-auto sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DumbbellIcon className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Freaky Fit</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              AI-powered health and fitness platform that adapts to your unique fitness journey
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Explore</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/training" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Training
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/nutrition" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Nutrition
              </Link>
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Profile
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe for fitness tips and exclusive updates
            </p>
            <form className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="h-9 text-sm"
                />
                <Button type="submit" size="sm">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="flex space-x-2 mt-4">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <InstagramIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <TwitterIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <FacebookIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BodyMind AI. All rights reserved.
          </p>
          <p className="flex items-center text-xs text-muted-foreground">
            Made by BodyMind AI Team
          </p>
        </div>
      </div>
    </footer>
  );
} 