"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SITE_PIN = "748079";
const SITE_PIN_COOKIE = "site_pin_ok";

export async function submitPin(formData: FormData) {
  const pin = formData.get("pin");

  if (typeof pin === "string" && pin === SITE_PIN) {
    cookies().set(SITE_PIN_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });

    redirect("/");
  }

  redirect("/pin?error=1");
}
