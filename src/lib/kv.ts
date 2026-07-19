import { PROMO_CODES, RELEASE_DATE } from "@/data/promo-codes"

const hasKv = () => {
  try {
    return !!import.meta.env.KV_REST_API_URL
  } catch {
    return false
  }
}

let kv: any = null

async function getKv() {
  if (!kv && hasKv()) {
    try {
      const { createClient } = await import("@vercel/kv")
      kv = createClient({
        url: import.meta.env.KV_REST_API_URL,
        token: import.meta.env.KV_REST_API_TOKEN,
      })
      console.log("[kv] Connected to Upstash Redis")
    } catch (e) {
      console.warn("[kv] Failed to connect, using memory store:", e)
      kv = null
    }
  }
  return kv
}

type Entry = { value: string; expiry: number }
const memoryStore: Record<string, Entry> = {}

function isExpired(e: Entry): boolean {
  return Date.now() > e.expiry
}

function memGet(key: string): string | null {
  const entry = memoryStore[key]
  if (!entry || isExpired(entry)) return null
  return entry.value
}

function memSet(key: string, value: string, ttlMs: number = Infinity) {
  memoryStore[key] = { value, expiry: Date.now() + ttlMs }
}

function memDel(key: string) {
  delete memoryStore[key]
}

export async function seedPromoCodes(): Promise<number> {
  const client = await getKv()
  if (client) {
    try {
      const exists = await client.exists("promo_codes_available")
      if (exists) return 0
      const added = await client.sadd("promo_codes_available", ...PROMO_CODES)
      await client.set("promo_codes_release_date", RELEASE_DATE.toISOString())
      console.log(`[kv] Seeded ${added} promo codes to Redis`)
      return added
    } catch (e) {
      console.warn("[kv] Redis seed failed, using memory:", e)
    }
  }

  if (memGet("promo_codes_available")) return 0
  memSet("promo_codes_available", JSON.stringify(PROMO_CODES))
  memSet("promo_codes_release_date", RELEASE_DATE.toISOString())
  console.log(`[kv] Seeded ${PROMO_CODES.length} promo codes in memory`)
  return PROMO_CODES.length
}

export async function getAvailableCode(): Promise<string | null> {
  const client = await getKv()
  if (client) {
    try {
      const code = await client.spop("promo_codes_available")
      if (code) {
        await client.sadd("promo_codes_redeemed", code)
        await client.incr("promo_codes_total_redeemed")
      }
      return code || null
    } catch (e) {
      console.warn("[kv] Redis spop failed, using memory:", e)
    }
  }

  const raw = memGet("promo_codes_available")
  if (!raw) return null
  const codes: string[] = JSON.parse(raw)
  if (codes.length === 0) return null
  const code = codes.shift()!
  memSet("promo_codes_available", JSON.stringify(codes))

  const redeemed = memGet("promo_codes_redeemed")
  const list: string[] = redeemed ? JSON.parse(redeemed) : []
  list.push(code)
  memSet("promo_codes_redeemed", JSON.stringify(list))
  return code
}

export async function remainingCodes(): Promise<number> {
  const client = await getKv()
  if (client) {
    try {
      return await client.scard("promo_codes_available")
    } catch {
      console.warn("[kv] Redis scard failed, using memory")
    }
  }
  const raw = memGet("promo_codes_available")
  if (!raw) return 0
  return JSON.parse(raw).length
}

export async function storeVerificationCode(email: string, code: string): Promise<void> {
  const key = `verify:${email.toLowerCase().trim()}`
  console.log(`[kv] Storing verification code for ${key}: ${code}`)

  const client = await getKv()
  if (client) {
    try {
      await client.setex(key, 600, code)
      console.log(`[kv] Stored in Redis: ${key}`)
      return
    } catch (e) {
      console.warn("[kv] Redis setex failed, using memory:", e)
    }
  }

  memSet(key, code, 600_000)
  console.log(`[kv] Stored in memory: ${key}`)
}

export async function verifyAndConsumeCode(email: string, code: string): Promise<boolean> {
  const key = `verify:${email.toLowerCase().trim()}`
  console.log(`[kv] Verifying code for ${key}: user_input=${code}`)

  const client = await getKv()
  if (client) {
    try {
      const stored = String(await client.get(key) ?? "")
      console.log(`[kv] Redis returned for ${key}: ${stored}`)
      if (stored === code) {
        await client.del(key)
        console.log(`[kv] Code verified for ${key}, deleted`)
        return true
      }
      console.log(`[kv] Code mismatch for ${key}: stored=${stored}, got=${code}`)
      return false
    } catch (e) {
      console.warn("[kv] Redis get failed, using memory:", e)
    }
  }

  const stored = memGet(key)
  console.log(`[kv] Memory returned for ${key}: ${stored}`)
  if (stored !== code) return false
  memDel(key)
  return true
}
