import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { email, name } = await req.json()

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Email and name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Kenova Portal <noreply@kenova.xyz>',
        to: [email],
        subject: '¡Bienvenido a Kenova Portal!',
        html: `
          <h1>¡Hola ${name}!</h1>
          <p>Tu cuenta en Kenova Portal ha sido aprobada.</p>
          <p>Ya puedes iniciar sesión y empezar a utilizar la plataforma.</p>
          <a href="${SUPABASE_URL}">Ir al portal</a>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: res.status,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
