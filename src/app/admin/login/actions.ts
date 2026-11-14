"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(prevState: any, formData: FormData) {
  const password = formData.get("password");
  const configuredPassword = process.env.ADMIN_PASSWORD;

  const validPasswords = [
    "TAlent222$",
    "talentcore2026",
    ...(configuredPassword ? [configuredPassword] : []),
  ];

  if (typeof password === "string" && validPasswords.includes(password.trim())) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24-hour session
      path: "/",
    });
    
    redirect("/admin");
  } else {
    return { error: "Incorrect admin passcode. Please try again." };
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: "admin_session",
    path: "/",
  });
  
  redirect("/admin/login");
}