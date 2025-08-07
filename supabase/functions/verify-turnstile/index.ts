// Cloudflare Turnstile verification endpoint
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Environment variables for Cloudflare Turnstile
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY');

// Log environment status (except the actual secret key)
console.log('Turnstile environment initialized', {
  hasSecretKey: !!TURNSTILE_SECRET_KEY,
  nodeEnv: Deno.env.get('NODE_ENV'),
  supabaseUrl: Deno.env.get('SUPABASE_URL')
});

// Helper function to verify the Turnstile token
async function verifyTurnstileToken(token: string, ip?: string) {
  if (!TURNSTILE_SECRET_KEY) {
    throw new Error('TURNSTILE_SECRET_KEY is not set in environment variables');
  }

  const formData = new FormData();
  formData.append('secret', TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  
  // Add the user's IP address if available for additional security
  if (ip) {
    formData.append('remoteip', ip);
  }

  console.log('Sending verification request to Turnstile');
  let response;
  let data;
  
  try {
    response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Turnstile API error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Turnstile API responded with status ${response.status}`);
    }

    data = await response.json();
    console.log('Turnstile response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error communicating with Turnstile API:', error);
    throw error;
  }
  return {
    success: data.success === true,
    challengeTs: data.challenge_ts,
    hostname: data.hostname,
    errorCodes: data['error-codes'] || [],
  };
}

// Main function to handle the request
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }

  try {
    // Log incoming request details
    console.log('Incoming request:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
      // Don't log the full body as it might contain sensitive data
    });

    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify({ ...body, token: body?.token ? '***' : 'missing' }, null, 2));
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }
    
    const { token } = body;
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: token' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    // Get the client IP from the request headers
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';
    
    // Verify the Turnstile token
    const result = await verifyTurnstileToken(token, clientIP);

    if (!result.success) {
      console.error('Turnstile verification failed:', result.errorCodes);
      return new Response(
        JSON.stringify({ 
          error: 'CAPTCHA verification failed',
          errorCodes: result.errorCodes,
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    // Success - token is valid
    return new Response(
      JSON.stringify({ 
        success: true,
        challengeTs: result.challengeTs,
        hostname: result.hostname,
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );

  } catch (error) {
    console.error('Error in verify-turnstile function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
});

// For local development and testing
// To test locally, run: supabase functions serve --no-verify-jwt
// Then make a POST request to http://localhost:54321/functions/v1/verify-turnstile with a valid token
