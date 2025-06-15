
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.52.7/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GradePayload {
    rubric_structured: { id: string; description: string; points: number }[];
    submissionContent: string;
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const openai = new OpenAI({
          apiKey: Deno.env.get("OPENAI_API_KEY"),
        });
        
        const { rubric_structured, submissionContent }: GradePayload = await req.json();

        const prompt = `
            Eres un asistente de evaluación para un profesor de programación. Tu tarea es calificar la entrega de un estudiante basándote en una rúbrica estructurada.
            Proporciona una calificación para cada criterio, un feedback general y una calificación total.

            Rúbrica:
            ${JSON.stringify(rubric_structured, null, 2)}

            Entrega del estudiante (puede ser código HTML, CSS, Javascript, etc.):
            \`\`\`
            ${submissionContent}
            \`\`\`

            Por favor, devuelve tu evaluación en formato JSON. El JSON debe tener la siguiente estructura y nada más:
            {
              "score_details": { "criterion_id_1": score_1, "criterion_id_2": score_2, ... },
              "total_score": number,
              "feedback": "string"
            }

            Reglas Importantes:
            1. Asegúrate de que cada "criterion_id" en "score_details" corresponda a un "id" de la rúbrica.
            2. La "total_score" DEBE ser la suma de las puntuaciones de cada criterio en "score_details".
            3. El "feedback" debe ser constructivo, en español, y explicar las fortalezas y debilidades de la entrega.
            4. El score para cada criterio no puede exceder el máximo de puntos para ese criterio.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const resultText = completion.choices[0].message.content;
        if (!resultText) {
          throw new Error("OpenAI returned an empty response.");
        }

        const result = JSON.parse(resultText);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });

    } catch (error) {
        console.error("Error grading submission:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }
});
