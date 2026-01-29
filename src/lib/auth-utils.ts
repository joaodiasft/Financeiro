import crypto from "crypto";

const SESSION_TTL_DAYS = 7;

export type SessionPayload = {
  userId: string;
  exp: number;
};

export function getAuthSecret() {
  return process.env.AUTH_SECRET || "seu-secret-super-seguro-aqui-change-in-production";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function createSessionToken(userId: string) {
  const exp = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  const payload: SessionPayload = { userId, exp };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) return null;
  
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    
    const expected = sign(encoded);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload?.userId || !payload.exp || payload.exp < Date.now()) return null;
    
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
