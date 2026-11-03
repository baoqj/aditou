const enc = new TextEncoder();
export const hex = (a: ArrayBuffer) =>
  Array.from(new Uint8Array(a), (x) => x.toString(16).padStart(2, "0")).join(
    "",
  );
export async function digest(s: string) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}
export const randomToken = () => crypto.randomUUID() + crypto.randomUUID();
export async function password(s: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(s),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return hex(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      key,
      256,
    ),
  );
}
