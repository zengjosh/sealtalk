import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface DailyQuote {
  id: string;
  date: string;
  quote: string;
  author: string;
  created_at: string;
}

// Fallback quotes when Edge Function is not available
const fallbackQuotes = [
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  }
];

export function useDailyQuote() {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodaysQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // First, try to get today's quote from the database
      const { data: existingQuote, error: fetchError } = await supabase
        .from('daily_quotes')
        .select('*')
        .eq('date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no quote exists yet
        console.error('Database fetch error:', fetchError);
        
        // If table doesn't exist, try to call the edge function directly
        if (fetchError.code === '42P01') {
          console.log('Table does not exist, calling edge function directly...');
          // Skip to edge function call
        } else {
          throw fetchError;
        }
      }

      if (existingQuote) {
        setQuote(existingQuote);
      } else {
        // If no quote exists for today, trigger the edge function to generate one
        console.log('No existing quote found, calling edge function...');
        const { data: functionResponse, error: functionError } = await supabase.functions
          .invoke('daily-quote', {
            method: 'POST',
          });

        console.log('Edge function response:', { functionResponse, functionError });

        if (functionError) {
          console.error('Edge function error:', functionError);
          console.log('Using fallback quote instead...');
          
          // Use fallback quote when Edge Function fails
          const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          const fallbackQuoteData: DailyQuote = {
            id: 'fallback-' + today,
            date: today,
            quote: fallbackQuote.quote,
            author: fallbackQuote.author,
            created_at: new Date().toISOString()
          };
          setQuote(fallbackQuoteData);
          return;
        }

        if (functionResponse?.success && functionResponse?.quote) {
          setQuote(functionResponse.quote);
        } else {
          console.error('Invalid response from edge function:', functionResponse);
          console.log('Using fallback quote instead...');
          
          // Use fallback quote when Edge Function returns invalid response
          const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          const fallbackQuoteData: DailyQuote = {
            id: 'fallback-' + today,
            date: today,
            quote: fallbackQuote.quote,
            author: fallbackQuote.author,
            created_at: new Date().toISOString()
          };
          setQuote(fallbackQuoteData);
        }
      }
    } catch (err) {
      console.error('Error fetching daily quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch daily quote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysQuote();
  }, []);

  return {
    quote,
    loading,
    error,
    refetch: fetchTodaysQuote,
  };
}
