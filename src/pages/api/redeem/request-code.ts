import type { APIRoute } from "astro"
import { Resend } from "resend"
import { isReleased } from "@/data/promo-codes"
import { seedPromoCodes, storeVerificationCode, remainingCodes } from "@/lib/kv"

const resend = new Resend(import.meta.env.RESEND_API_KEY)

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isReleased()) {
      return new Response(
        JSON.stringify({ success: false, error: "El canje estará disponible a partir del 4 de septiembre de 2026." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    await seedPromoCodes()

    const body = await request.json()
    const { email } = body

    if (typeof email !== "string" || !email.includes("@") || email.length < 5) {
      return new Response(
        JSON.stringify({ success: false, error: "Email inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const remaining = await remainingCodes()
    if (remaining <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Todos los códigos promocionales ya fueron canjeados." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const code = generateCode()
    await storeVerificationCode(email, code)

    await resend.emails.send({
      from: "LLLIT <no-reply@mtsprz.org>",
      to: email,
      subject: "Tu código de verificación — LLLIT",
      html: `<div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #111; color: #eee; border-radius: 12px;">
        <p style="font-size: 14px; color: #999;">LLLIT · Canje de código promocional</p>
        <h1 style="font-size: 20px; font-weight: 600; margin: 24px 0 8px;">Tu código de verificación</h1>
        <p style="font-size: 14px; color: #aaa; margin-bottom: 24px;">Ingresá este código en la web para continuar:</p>
        <div style="background: #222; border: 1px solid #333; border-radius: 8px; padding: 20px; text-align: center; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #fff; font-family: monospace;">
          ${code}
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 24px;">Este código expira en 10 minutos.</p>
      </div>`,
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("request-code error:", error)
    return new Response(
      JSON.stringify({ success: false, error: "Error al enviar el código. Intentalo de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
