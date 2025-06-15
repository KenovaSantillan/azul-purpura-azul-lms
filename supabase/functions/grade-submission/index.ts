
import 'https://deno.land/x/xhr@0.1.0/mod.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { OpenAI } from "https://deno.land/x/openai@v4.49.1/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { submissionContent, rubric } = await req.json()
    if (!submissionContent || !rubric) {
      return new Response(JSON.stringify({ error: 'submissionContent and rubric are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!openAIApiKey) {
        throw new Error("OPENAI_API_KEY is not set.");
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
            Eres un asistente de profesor experto en evaluar trabajos de estudiantes.
            Tu tarea es evaluar una entrega de un estudiante basándote en una rúbrica específica.
            Proporciona una puntuación numérica del 0 al 100 y un feedback constructivo.
            La puntuación debe ser un número entero.
            El feedback debe ser claro, conciso y ayudar al estudiante a mejorar.
            Debes responder en formato JSON con dos claves: "score" (number) y "feedback" (string).
            No incluyas nada más en tu respuesta fuera del objeto JSON.
          `.trim(),
        },
        {
          role: 'user',
          content: `
            Por favor, evalúa la siguiente entrega basándote en la rúbrica proporcionada.

            **Rúbrica de Evaluación:**
            ---
            ${rubric}
            ---

            **Entrega del Estudiante:**
            ---
            ${submissionContent}
            ---
          `.trim(),
        },
      ],
      response_format: { type: "json_object" },
    })

    const result = completion.choices[0].message.content;
    
    if (!result) {
        throw new Error("Failed to get a valid response from AI.");
    }

    return new Response(result, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
