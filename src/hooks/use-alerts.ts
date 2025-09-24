
import { useToast } from '@/hooks/use-toast';

/**
 * A custom hook for displaying instant alert notifications.
 */
export const useAlerts = () => {
  const { toast } = useToast();

  const showAlert = (title: string, description: string, variant: 'default' | 'destructive' | 'success' = 'default') => {
    toast({ title, description, variant });
  };

  return { showAlert };
};
