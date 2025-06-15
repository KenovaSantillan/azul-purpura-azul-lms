
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TutorAlertPayload {
  studentName: string;
  groupName: string;
  tutorEmail: string;
  tutorName: string;
  criteria: string[];
  description: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const payload: TutorAlertPayload = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Portal Kenova <onboarding@resend.dev>",
      to: [payload.tutorEmail],
      subject: `Alerta de Conducta: ${payload.studentName} - Grupo ${payload.groupName}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Alerta de Conducta</h2>
            <p>Estimado/a tutor/a ${payload.tutorName},</p>
            <p>Se ha generado un reporte de conducta para el alumno <strong>${payload.studentName}</strong> del grupo <strong>${payload.groupName}</strong>.</p>
            <h3>Detalles del Reporte:</h3>
            <p><strong>Motivos de la alerta:</strong></p>
            <ul>
              ${payload.criteria.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <p><strong>Descripción de la situación:</strong></p>
            <p style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">${payload.description}</p>
            <p>Por favor, tome las acciones que considere pertinentes.</p>
            <p>Atentamente,<br/>Sistema de Gestión Educativa Kenova</p>
          </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
