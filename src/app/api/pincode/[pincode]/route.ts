import { NextResponse } from "next/server";

// India Post's public PIN directory. Proxied rather than called from the
// browser so the lookup is cached once for every visitor, survives ad
// blockers, and can't be shaped by the client.
const PINCODE_API = "https://api.postalpincode.in/pincode";
const LOOKUP_TIMEOUT_MS = 8_000;
// PIN codes effectively never change; re-check monthly.
const CACHE_SECONDS = 60 * 60 * 24 * 30;

interface PincodeMatch {
  state: string;
  district: string;
  areas: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, max = 100): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseMatch(payload: unknown): PincodeMatch | null {
  // The API answers with a single-element array.
  const entry = Array.isArray(payload) ? payload[0] : null;
  if (!isRecord(entry) || entry.Status !== "Success") return null;
  if (!Array.isArray(entry.PostOffice) || entry.PostOffice.length === 0) return null;

  const offices = entry.PostOffice.filter(isRecord);
  const first = offices[0];
  if (!first) return null;

  const state = text(first.State);
  const district = text(first.District);
  if (!state || !district) return null;

  // One PIN can cover several post offices; offer their names as hints.
  const areas = Array.from(
    new Set(offices.map((office) => text(office.Name)).filter(Boolean))
  ).slice(0, 12);

  return { state, district, areas };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pincode: string }> }
) {
  const { pincode } = await params;
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { found: false, error: "A PIN code must be exactly 6 digits." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${PINCODE_API}/${pincode}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: CACHE_SECONDS },
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`pincode lookup responded ${res.status}`);
      return NextResponse.json({ found: false }, { status: 502 });
    }

    const match = parseMatch(await res.json());
    if (!match) {
      return NextResponse.json(
        { found: false },
        // Unknown PINs are cached too, so typos don't hit the API repeatedly.
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );
    }

    return NextResponse.json(
      { found: true, ...match },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch (error) {
    console.error("pincode lookup failed", error);
    return NextResponse.json({ found: false }, { status: 502 });
  }
}
