import { auth, signOut } from "@/lib/auth"
import { ShieldX } from "lucide-react"

export default async function AccessDeniedPage() {
  const session = await auth()
  const userEmail = session?.user?.email || "Unknown"

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>

          <p className="text-slate-500 mb-6">
            Your email address is not authorized to access this application.
          </p>

          {/* User Email */}
          <div className="bg-slate-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-500 mb-1">Signed in as:</p>
            <p className="font-medium text-slate-700">{userEmail}</p>
          </div>

          <p className="text-sm text-slate-400 mb-6">
            If you believe this is an error, please contact your administrator
            to be added to the authorized users list.
          </p>

          {/* Sign Out Form */}
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/signin" })
            }}
          >
            <button
              type="submit"
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              Sign Out
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-xs text-slate-400">
            LinkedIn Copywriter • Internal Use Only
          </p>
        </div>
      </div>
    </div>
  )
}
