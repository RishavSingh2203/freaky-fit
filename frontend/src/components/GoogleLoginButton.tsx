import { Button } from "@/components/ui/Button";
import { Icons } from "./icons";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full"
    >
      <Icons.google className="mr-2 w-4 h-4" />
      Continue with Google
    </Button>
  );
} 