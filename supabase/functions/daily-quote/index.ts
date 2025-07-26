import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) throw new Error('GEMINI_API_KEY is not defined')

    const promptText = `Your Persona: You are a celebrated philosopher, but with a peculiar seal-like obsession and a name that playfully hints at this. You deliver profound, yet hilariously grounded, wisdom.
The Goal: Generate a "Quote of the Day" that sounds like it could come from a famous philosopher, but is entirely about the life of a seal. The humor should stem from the fusion of high-minded philosophical concepts with the simple, often mundane, realities of being a seal, delivered by a philosopher with a seal-themed moniker.
Key Elements to Include:
The "Philosopher": Invent a philosopher's name that has a pun or twist related to seals, their environment, or behaviors. Examples: "Aristot-whale," "Socrates P. Seal," "Plato-pus," "Heracli-flipper," "Nietzsche-cean."
The Core Philosophical Concept: The quote should loosely touch upon a well-known philosophical idea or theme, such as:
- Duality/Balance: The interplay between two opposing forces (e.g., action vs. contemplation, the sea vs. the land, hunger vs. satiety).
- The Nature of Reality: Questioning what is truly important or real (e.g., a good nap vs. the vastness of the ocean).
- The Pursuit of Happiness/Meaning: Finding contentment in simple things.
- Epistemology (The Nature of Knowledge): What does a seal truly know?
- Existentialism: The freedom and responsibility of choosing one's actions (or naps).
Seal Behaviors & Environment: Ground the philosophical musings in concrete seal actions and their world:
- Basking on rocks.
- The "banana pose."
- Hunting fish.
- The cold plunge.
- Slippery surfaces.
- The joy of a full belly.
- The collective "bark" of a colony.
Tone: Profound, contemplative, and slightly absurd, as if a renowned thinker has genuinely spent years contemplating the existential dilemmas of a pinniped.
Formatting: Do not use any markdown formatting such as asterisks or underscores for emphasis.
Your Task:
Generate a new, original "Quote of the Day" following these instructions.
IMPORTANT: The final output must strictly follow this format: Quote: "[The generated quote]" - [The Seal-Philosopher's Name]`

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          temperature: 1.2,
          topK: 40,
          maxOutputTokens: 200,
        },
      })
    })

    if (!geminiRes.ok) throw new Error(`Gemini API error: ${geminiRes.status}`)

    const geminiJson = await geminiRes.json()
    const rawText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) throw new Error('No quote returned from Gemini API')

    const match = rawText.match(/Quote:\s*"([^"]+)"\s*-\s*(.+)/)
    const quote = match ? match[1] : rawText
    const author = match ? match[2].trim() : 'Anonymous'

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('daily_quotes')
      .select('*')
      .eq('date', today)
      .maybeSingle()

    if (existing) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Quote already exists',
        quote: existing
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
    }

    const { data: inserted, error } = await supabase
      .from('daily_quotes')
      .insert([{ date: today, quote, author, created_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) {
      console.error('Database insertion error:', error)
      throw new Error(`DB insert error: ${error.message || error.details || JSON.stringify(error)}`)
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'New quote generated',
      quote: inserted
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })

  } catch (err) {
    console.error('Daily quote error:', err)
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 })
  }
})
