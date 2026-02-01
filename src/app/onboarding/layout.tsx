export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  );
}
