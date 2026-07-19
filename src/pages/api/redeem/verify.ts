import type { APIRoute } from "astro"
import { isReleased } from "@/data/promo-codes"
import { seedPromoCodes, verifyAndConsumeCode, getAvailableCode } from "@/lib/kv"

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
    const { email, verificationCode } = body

    if (typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, error: "Email inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    if (typeof verificationCode !== "string" || verificationCode.length !== 4 || !/^\d{4}$/.test(verificationCode)) {
      return new Response(
        JSON.stringify({ success: false, error: "Código inválido. Debe ser un código de 4 dígitos." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const verified = await verifyAndConsumeCode(email, verificationCode)
    if (!verified) {
      return new Response(
        JSON.stringify({ success: false, error: "Código incorrecto o expirado. Solicitá uno nuevo." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const promoCode = await getAvailableCode()
    if (!promoCode) {
      return new Response(
        JSON.stringify({ success: false, error: "No quedan códigos promocionales disponibles." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, promoCode }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("verify error:", error)
    return new Response(
      JSON.stringify({ success: false, error: "Error del servidor. Intentalo de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
