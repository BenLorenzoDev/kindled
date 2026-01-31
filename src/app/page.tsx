import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ChatInterface } from '@/components/chat/chat-interface';
import { UserMenu } from '@/components/auth/user-menu';

export default async function Home() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect('/signin');
  }

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col bg-[#F4F2EE]">
      {/* LinkedIn-style Header */}
      <header className="h-[52px] shrink-0 bg-white border-b border-[rgba(0,0,0,0.08)] flex items-center px-4 justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2">
          {/* LinkedIn-style Logo */}
          <div className="w-[34px] h-[34px] bg-[#0A66C2] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">in</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-[rgba(0,0,0,0.9)]">
              Copywriter
            </h1>
            <p className="text-[11px] text-[rgba(0,0,0,0.6)] -mt-0.5">
              AI-Powered Content
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge - LinkedIn style */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[rgba(0,0,0,0.6)] bg-[#EEF3F8] px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-[#057642] rounded-full"></span>
            <span>Ready</span>
          </div>
          <UserMenu user={session.user} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
