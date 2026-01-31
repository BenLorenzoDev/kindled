import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { OnboardingWizard } from './components/OnboardingWizard';

export const metadata = {
  title: 'Setup Your Content Strategy | Kindled',
  description: 'Answer a few questions to generate your personalized LinkedIn content strategy.',
};

export default async function OnboardingPage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect('/signin');
  }

  return <OnboardingWizard />;
}
