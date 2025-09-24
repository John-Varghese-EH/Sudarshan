"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// --- Helper functions for cookie management ---

/**
 * Sets a session cookie.
 * @param name The name of the cookie.
 * @param value The value of the cookie.
 */
function setSessionCookie(name: string, value: string) {
  // "; path=/" ensures the cookie is available across the entire site.
  // "SameSite=Strict" helps protect against cross-site request forgery (CSRF) attacks.
  // "Secure" ensures the cookie is only sent over HTTPS. In development, you might omit this.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict; Secure`;
}

/**
 * Retrieves a cookie's value by its name.
 * @param name The name of the cookie to retrieve.
 * @returns The cookie's value or an empty string if not found.
 */
function getCookie(name: string): string {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()\\\[\\\]\\\\\\\\/+^])/g, '\\\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : "";
}

/**
 * Sudarshan Screen Component
 * 
 * Implements a client-side password gate to protect page content.
 * It uses a session cookie to maintain the authentication state for the duration
 * of the browser session.
 */
export default function SudarshanPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const SUDARSHAN_AUTH_COOKIE = "sudarshan_auth";
  const CORRECT_PASSWORD = "MyStic@25";

  // On component mount, check if the user is already authenticated via session cookie.
  useEffect(() => {
    if (getCookie(SUDARSHAN_AUTH_COOKIE) === "granted") {
      setIsAuthenticated(true);
    }
    setIsAuthChecked(true);
  }, []);

  /**
   * Handles the password submission.
   */
  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      // Correct password: grant access and set session cookie.
      setSessionCookie(SUDARSHAN_AUTH_COOKIE, "granted");
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the Sudarshan screen.",
      });
      // Clear password field for security.
      setPassword(''); 
    } else {
      // Incorrect password: show an error toast.
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
      });
      setPassword('');
    }
  };

  // Wait until the authentication check is complete before rendering anything.
  // This prevents content flashing or incorrect UI state on initial load.
  if (!isAuthChecked) {
    return null;
  }

  if (isAuthenticated) {
    // --- Authenticated Content ---
    // Once authenticated, render the main content of the Sudarshan screen.
    return (
      <div id="sudarshan-content" className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Sudarshan Screen</h1>
        <p>This is the protected content. You have been authenticated for this session.</p>
        {/*
          Setup Notes:
          - You can place all your Sudarshan-specific components and logic here.
          - This content is only visible after successful password entry.
        */}
      </div>
    );
  } else {
    // --- Password Prompt Dialog ---
    // If not authenticated, show the password dialog.
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Enter the password to access the Sudarshan screen. This is a one-time prompt for your browser session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password-input" className="text-right">
                Password
              </Label>
              <Input
                id="password-input"
                type="password"
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Enter password..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordSubmit}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}

/*
--- Security Best Practices & Firebase Authentication ---

The implementation above uses a simple client-side check with a hardcoded password.
This is suitable for low-security demos or internal tools but is NOT secure for production environments.

**Why this is not for production:**
1.  **Hardcoded Password:** The password "MyStic@25" is visible in the client-side JavaScript source code. Anyone can inspect the code and find it.
2.  **Client-Side Logic:** The entire authentication check happens in the browser. A savvy user can bypass this by manually setting the 'sudarshan_auth' cookie or by manipulating the JavaScript execution.
3.  **Plaintext Credential:** Storing passwords, even for a short time, in client-side code is a major security risk.

**Recommendations for Enterprise Scenarios (using Firebase):**

For a secure, production-ready solution, you should use a proper authentication provider like Firebase Authentication.

1.  **Use Firebase Authentication:**
    - Set up Firebase Authentication in your project.
    - Instead of a shared password, create user accounts (e.g., email/password, Google Sign-In, etc.).
    - This avoids hardcoding credentials and provides robust user management.

2.  **Implement Server-Side Sessions:**
    - Storing authentication state in a client-side cookie is vulnerable. A better approach is to use HTTP-only, secure session cookies managed by your backend.
    - The flow would be:
      a. User signs in on the client using Firebase SDK (`signInWithEmailAndPassword`).
      b. The client gets a Firebase ID Token.
      c. The client sends this ID Token to a dedicated backend endpoint (e.g., an API route in your Next.js app).
      d. Your backend verifies the ID Token using the Firebase Admin SDK.
      e. If valid, the backend creates a session cookie (`httpOnly`, `secure`) and sets it on the user\'s browser.
      f. For subsequent requests to protected pages, the browser automatically sends the session cookie. Your backend middleware verifies this cookie before serving the protected content.

    - This pattern prevents client-side scripts from accessing the authentication token (thanks to `httpOnly`) and ensures that your server is the single source of truth for authentication status. Firebase has built-in support for managing session cookies.
*/