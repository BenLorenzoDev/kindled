'use client'

import { signOut } from "next-auth/react"
import Image from "next/image"
import { LogOut, User } from "lucide-react"

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500" />
          </div>
        )}
        <div className="hidden sm:block text-sm">
          <p className="font-medium text-slate-700">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  )
}
