"use client";

import { LogOut } from "lucide-react";
import { adminLogout } from "./login/actions";

export default function LogoutButton() {
  return (
    <form action={adminLogout}>
      <button 
        type="submit" 
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-left cursor-pointer"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </form>
  );
}