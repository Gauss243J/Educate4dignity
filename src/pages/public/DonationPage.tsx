import React, { useState } from 'react';
import { Lock, Users, Megaphone, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { trackEvent } from '../../utils/analytics';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '../../services/checkoutSession';
import PublicPageShell from '../../components/layout/PublicPageShell';

const DonationPage: React.FC = () => {
  const { t } = useTranslation();
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('general');
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    anonymous: false
  });

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const projects = [
    { id: 'kits', name: 'Menstrual Kits Distribution', description: 'Reusable pad + pouch + basic guide for students' },
    { id: 'education', name: 'School Education Sessions', description: 'Interactive menstrual health & dignity lessons' },
    { id: 'wash', name: 'WASH & Privacy Upgrades', description: 'Partitions, disposal bins & handwashing access' },
    { id: 'monitoring', name: 'Monitoring & Data', description: 'Evidence collection to improve impact & scale' }
  ];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getFinalAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonation = async () => {
    const amount = getFinalAmount();
    if (amount <= 0) {
      alert('Please select or enter a valid donation amount');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fallback: if a test checkout URL is provided (no backend yet), just redirect there.
      const testUrl = import.meta.env.VITE_STRIPE_CHECKOUT_TEST_URL as string | undefined;
      if (testUrl) {
        trackEvent({ name: 'donation_test_redirect', properties: { amount, via: 'TEST_URL' } });
        window.location.href = testUrl;
        return;
      }
      trackEvent({ name: 'donation_initiated', properties: { amount, donationType, project: selectedProject } });
      const session = await createCheckoutSession({
        amountCents: Math.round(amount * 100),
        currency: 'usd',
        donationType,
        projectId: selectedProject,
        donor: {
          firstName: donorInfo.firstName,
            lastName: donorInfo.lastName,
            email: donorInfo.email,
            anonymous: donorInfo.anonymous
        }
      });
      if (session.error) {
        throw new Error(session.error);
      }
      const stripePk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
      if (!stripePk) {
        throw new Error('Missing Stripe publishable key (VITE_STRIPE_PUBLISHABLE_KEY)');
      }
      const stripe = await loadStripe(stripePk);
      if (!stripe) throw new Error('Stripe failed to initialize');
      // Prefer redirectToCheckout with session id
  // Type note: Some Stripe type versions may not surface redirectToCheckout; cast as any to avoid TS mismatch.
  const { error: redirectErr } = await (stripe as any).redirectToCheckout({ sessionId: session.id });
      if (redirectErr) {
        throw new Error(redirectErr.message);
      }
      trackEvent({ name: 'donation_checkout_redirect', properties: { amount } });
    } catch (e: any) {
      trackEvent({ name: 'donation_failed', properties: { amount, error: e.message } });
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicPageShell>
      {/* Header */}
      <header className="mb-8 space-y-2 text-center">
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">{t('donation.title','Keep girls learning every month')}</h1>
        <p className="text-[14px] leading-[20px] text-secondary max-w-prose mx-auto">Your gift funds menstrual kits, school sessions and basic WASH improvements so no girl misses class because of her period.</p>
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-10">

        {/* Impact Tiers (updated Euro amounts) */}
        <section className="rounded-xl border border-base bg-white p-6" aria-labelledby="impact-tiers-heading">
          <h2 id="impact-tiers-heading" className="sr-only">Donation impact tiers</h2>
          <dl className="flex flex-col md:flex-row md:divide-x md:divide-base">
            <div className="flex-1 text-center py-4 md:py-0 md:px-6">
              <dt className="text-[22px] leading-[26px] font-extrabold tracking-tight text-primary">€15</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-secondary max-w-[240px] mx-auto">1 menstrual hygiene kit for 6 months</dd>
            </div>
            <div className="flex-1 text-center py-4 md:py-0 md:px-6 border-t md:border-t-0 border-base">
              <dt className="text-[22px] leading-[26px] font-extrabold tracking-tight text-primary">€50</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-secondary max-w-[240px] mx-auto">Full training for a class of 30 students</dd>
            </div>
            <div className="flex-1 text-center py-4 md:py-0 md:px-6 border-t md:border-t-0 border-base">
              <dt className="text-[22px] leading-[26px] font-extrabold tracking-tight text-primary">€100</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-secondary max-w-[240px] mx-auto">Equip a school with adapted facilities</dd>
            </div>
          </dl>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card className="rounded-xl border border-base bg-white">
            <CardHeader>
              <CardTitle className="text-[16px] leading-[22px] font-semibold text-primary">Your Donation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Donation Type
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 h-10 px-3 rounded-full border text-[13px] transition-colors ${ donationType === 'one-time' ? 'border-primary bg-[var(--color-primary-light)] text-primary' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType('recurring')}
                    className={`flex-1 h-10 px-3 rounded-full border text-[13px] transition-colors ${ donationType === 'recurring' ? 'border-primary bg-[var(--color-primary-light)] text-primary' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                  >
                    Monthly
                    <Badge variant="primary" size="sm" className="ml-2">
                      Most Impact
                    </Badge>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Amount (USD) – supports kits & education
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`h-10 px-3 rounded-full border text-[13px] transition-colors ${ selectedAmount === amount && !customAmount ? 'border-primary bg-[var(--color-primary-light)] text-primary' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Focus Area
                </label>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors ${ selectedProject === project.id ? 'border-primary bg-[var(--color-primary-light)]' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                    >
                      <div className="font-medium text-primary text-[13px]">{project.name}</div>
                      <div className="text-secondary text-[12px] leading-[18px]">{project.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Donation Summary */}
              <div className="p-4 rounded-xl border border-base bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary text-[13px]">
                    {donationType === 'recurring' ? 'Monthly' : 'One-time'} donation:
                  </span>
                  <span className="text-[20px] font-semibold text-primary">
                    ${getFinalAmount()}
                  </span>
                </div>
                <div className="text-secondary text-[11px] leading-[18px] mt-1">
                  Focus: {projects.find(p => p.id === selectedProject)?.name}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donor Information */}
          <Card className="rounded-xl border border-base bg-white">
            <CardHeader>
              <CardTitle className="text-[16px] leading-[22px] font-semibold text-primary">Donor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={donorInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={donorInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={donorInfo.email}
                  onChange={handleInputChange}
                  required
                  placeholder="For donation receipt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Phone (Optional)
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={donorInfo.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Address (Optional)
                </label>
                <Input
                  name="address"
                  value={donorInfo.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    City
                  </label>
                  <Input
                    name="city"
                    value={donorInfo.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Country
                  </label>
                  <Input
                    name="country"
                    value={donorInfo.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                  checked={donorInfo.anonymous}
                  onChange={handleInputChange}
                  className="rounded border-border focus:ring-primary"
                />
                <label htmlFor="anonymous" className="text-sm text-text-secondary">
                  Make this donation anonymous
                </label>
              </div>

              {/* Tax Information */}
              <div className="p-4 rounded-xl border border-base bg-white">
                <div className="text-[12px] leading-[18px] text-secondary">
                  <strong>Tax Deductible:</strong> Your donation is tax-deductible to the full extent allowed by law. 
                  You will receive a receipt via email for your records.
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handleDonation}
                className="w-full text-lg py-3"
                disabled={getFinalAmount() <= 0 || loading}
              >
                {loading ? 'Preparing secure checkout...' : `Donate $${getFinalAmount()} with Stripe`}
              </Button>

              {error && (
                <div className="text-[12px] leading-[18px] text-red-600 text-center">
                  {error}
                </div>
              )}

              <div className="text-center text-[11px] leading-[18px] text-secondary">
                Secure payment processing by Stripe<br />
                <span className="inline-flex items-center gap-1"><Lock size={14} /> Your information is safe and encrypted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Ways to Help */}
        <div className="mt-12">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary text-center mb-6">Other Ways to Support Dignity</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center rounded-xl border border-base bg-white">
              <CardContent className="py-6 px-4 space-y-3">
                <div className="text-primary/70"><Users className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-[15px] text-primary">Volunteer</h3>
                <p className="text-secondary text-[12px] leading-[18px]">Assist during distribution days or education sessions.</p>
                <Button variant="secondary" className="h-8 px-3 text-[12px] rounded-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl border border-base bg-white">
              <CardContent className="py-6 px-4 space-y-3">
                <div className="text-primary/70"><Megaphone className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-[15px] text-primary">Spread the Word</h3>
                <p className="text-secondary text-[12px] leading-[18px]">Normalize menstrual health conversations in your network.</p>
                <Button variant="secondary" className="h-8 px-3 text-[12px] rounded-full">Share</Button>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl border border-base bg-white">
              <CardContent className="py-6 px-4 space-y-3">
                <div className="text-primary/70"><Building2 className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-[15px] text-primary">Corporate Partnership</h3>
                <p className="text-secondary text-[12px] leading-[18px]">Sponsor kits or fund a school WASH improvement cluster.</p>
                <Button variant="secondary" className="h-8 px-3 text-[12px] rounded-full">Contact Us</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto rounded-xl border border-base bg-white">
            <CardContent className="py-6 px-6 space-y-3">
              <h3 className="font-semibold text-[15px] text-primary">Transparency Promise</h3>
              <p className="text-secondary text-[12px] leading-[18px]">
                We believe in transparency. Track how your donation is used through detailed reports and impact tracking.
              </p>
              <Button variant="secondary" className="h-8 px-4 text-[12px] rounded-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default DonationPage;
