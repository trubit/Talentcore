"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(prevState: any, formData: FormData) {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "talentcore2026" : "");

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not configured.");
    return { error: "Server authentication misconfiguration. Please contact admin." };
  }

  if (password === adminPassword) {
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