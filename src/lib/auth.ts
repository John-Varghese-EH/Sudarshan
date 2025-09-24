
import { getAuth, signOut } from 'firebase/auth';
import { app } from './firebase-config'; // Assuming you have this file exporting the initialized firebase app

/**
 * Logs the current user out.
 * @returns A promise that resolves when the logout is complete.
 */
export const logout = async (): Promise<void> => {
  const auth = getAuth(app);
  try {
    await signOut(auth);
    console.log('User logged out successfully');
    // You might want to redirect the user to the login page after logout
    // For example, using Next.js router:
    // Router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
