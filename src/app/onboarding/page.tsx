import { OnboardingWizard } from './components/OnboardingWizard';

export const metadata = {
  title: 'Setup Your Content Strategy | Kindled',
  description: 'Answer a few questions to generate your personalized LinkedIn content strategy.',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
