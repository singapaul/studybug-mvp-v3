export type PlanType = 'free' | 'student' | 'teacher' | 'school';
export type BillingCycle = 'monthly' | 'annual';
export type AccountType = 'student' | 'teacher' | 'parent';

export interface PlanDetails {
  id: PlanType;
  name: string;
  description: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  negativeFeatures?: string[];
  highlighted?: boolean;
  badge?: string;
  badgeColor?: 'primary' | 'accent' | 'secondary';
  ctaText: string;
  tier: 'free' | 'standard' | 'premium' | 'enterprise';
}

export interface SignupFormData {
  plan: PlanType;
  billingCycle: BillingCycle;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  childName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  billingPostcode: string;
  agreedToTerms: boolean;
}

export interface SchoolDemoFormData {
  schoolName: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  numberOfStudents: string;
  numberOfTeachers: string;
  preferredContactTime: string[];
  specificDate: string;
  additionalNotes: string;
}

export const PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    subtitle: 'Perfect for trying out',
    monthlyPrice: 0,
    annualPrice: 0,
    features: ['3 game modes', '10 pre-built subjects', 'No account required to try'],
    negativeFeatures: ['No custom decks', 'No progress saving'],
    ctaText: 'Start Free',
    tier: 'free',
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Perfect for individual learners',
    subtitle: 'Perfect for independent learners',
    monthlyPrice: 5,
    annualPrice: 45,
    features: [
      'All game modes unlocked',
      'Access all pre-built decks',
      'Create unlimited custom decks',
      'Save progress & track performance',
      'Share decks with friends',
      'Study offline mode',
    ],
    highlighted: true,
    badge: 'Most Popular',
    badgeColor: 'primary',
    ctaText: 'Start 14-Day Free Trial',
    tier: 'standard',
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Ideal for educators & tutors',
    subtitle: 'Everything students get, plus classroom tools',
    monthlyPrice: 12,
    annualPrice: 100,
    features: [
      'Everything in Student Plan',
      'Publish to shared library',
      'Track student progress',
      'Export/import decks',
      'Priority email support',
      'Lesson plan templates',
    ],
    badge: 'Best for Educators',
    badgeColor: 'accent',
    ctaText: 'Start 14-Day Free Trial',
    tier: 'premium',
  },
  {
    id: 'school',
    name: 'School',
    description: 'For entire institutions',
    subtitle: 'For schools, academies & institutions',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Everything in Teacher Plan',
      'Unlimited teacher & student accounts',
      'Admin dashboard & analytics',
      'Single Sign-On (SSO)',
      'Invoice billing available',
      'Dedicated account manager',
      'Custom onboarding & training',
    ],
    badge: 'Enterprise',
    badgeColor: 'secondary',
    ctaText: 'Request Demo',
    tier: 'enterprise',
  },
];
