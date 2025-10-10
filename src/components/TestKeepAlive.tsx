import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const TestKeepAlive = () => {
  const [testing, setTesting] = useState(false);

  const testKeepAlive = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('keep-alive', {
        body: { manual_test: true }
      });

      if (error) {
        console.error('Keep-alive test error:', error);
        toast.error(`Test failed: ${error.message}`);
      } else {
        console.log('Keep-alive test result:', data);
        toast.success(`Test successful! ${data.message}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Unexpected error occurred');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={testKeepAlive} 
        disabled={testing}
        variant="outline"
        size="sm"
      >
        {testing ? 'Testing...' : 'Test Keep-Alive'}
      </Button>
    </div>
  );
};
