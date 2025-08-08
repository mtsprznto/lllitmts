// src/pages/api/contact.ts
export const prerender = false;

import type { APIContext } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }: APIContext) {
  const body = await request.json();
  const { name, email, message } = body;

  try {
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !email.includes("@") ||
      name.length < 2 ||
      message.length < 5
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Datos inválidos" }),
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "no-reply@mtsprz.org", // debe estar verificado en Resend
      to: "matiaspereznauto@gmail.com", // destinatario (vos mismo)
      subject: `Nuevo mensaje de ${name}`,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong><br/>${message}</p>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
