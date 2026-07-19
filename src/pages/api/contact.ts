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

    const html = `<p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong><br/>${message}</p>`

    await resend.emails.send({
      from: "LLLIT <no-reply@mtsprz.org>",
      to: "contacto@mtsprz.org",
      subject: `Nuevo mensaje de ${name}`,
      html,
    })

    await resend.emails.send({
      from: "LLLIT <no-reply@mtsprz.org>",
      to: email,
      subject: "Copia de tu mensaje — LLLIT",
      html: `<p>Hola ${name},</p>
        <p>Recibimos tu mensaje. Te respondemos a la brevedad.</p>
        ${html}
        <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999;">LLLIT · contacto@mtsprz.org</p>`,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
