import crypto from "crypto";

// Use a fallback secret if the env variable is not set
const SECRET = process.env.ADMIN_JWT_SECRET || "lala-secret-salt-key-2026-dynamic-token-signing";

/**
 * Hashes a password using PBKDF2 with the secret as salt.
 */
export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, SECRET, 1000, 64, "sha512").toString("hex");
}

/**
 * Creates a signed session token.
 * Token format: username:expiryTime:signature
 */
export function createSessionToken(username: string): string {
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  const expires = Date.now() + SESSION_DURATION;
  const data = `${username}:${expires}`;
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}:${signature}`;
}

/**
 * Verifies a session token.
 * Checks signature validity and expiry.
 */
export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;
    
    const [username, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);
    
    // Check if expired
    if (isNaN(expires) || expires < Date.now()) {
      return null;
    }
    
    // Verify HMAC signature
    const data = `${username}:${expires}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    return { username };
  } catch (error) {
    return null;
  }
}
