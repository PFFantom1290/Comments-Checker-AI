import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const name = (body.name ?? "").trim() || null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD} characters.` },
      { status: 400 }
    );
  }

  try {
    const user = await createUser({ email, password, name });
    return NextResponse.json({ ok: true, email: user.email }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return NextResponse.json(
        { error: "An account with that email already exists. Try signing in." },
        { status: 409 }
      );
    }
    console.error("[register] error:", err);
    return NextResponse.json({ error: "Could not create account. Try again." }, { status: 500 });
  }
}
