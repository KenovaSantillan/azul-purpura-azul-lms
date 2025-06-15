
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParentAlertPayload {
  studentName: string;
  groupName: string;
  parentEmail: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const payload: ParentAlertPayload = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Portal Kenova <onboarding@resend.dev>",
      to: [payload.parentEmail],
      subject: `Comunicado sobre ${payload.studentName} - Grupo ${payload.groupName}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Comunicado Importante</h2>
            <p>Estimado padre, madre o tutor,</p>
            <p>Le escribimos para informarle sobre su hijo/a <strong>${payload.studentName}</strong> del grupo <strong>${payload.groupName}</strong>.</p>
            <h3>Mensaje:</h3>
            <p style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">${payload.message}</p>
            <p>Para cualquier aclaración, por favor póngase en contacto con la institución.</p>
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
