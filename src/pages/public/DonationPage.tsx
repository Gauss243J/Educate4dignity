import React, { useState } from 'react';
import { Lock, Users, Megaphone, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { processDonation } from '../../utils/payments';
import { sendNotification } from '../../utils/notifications';
import { trackEvent } from '../../utils/analytics';
import PublicNav from '../../components/layout/PublicNav';

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
    { id: 'general', name: 'Where most needed', description: 'Support our most urgent initiatives' },
    { id: 'water', name: 'Clean Water Initiative', description: 'Provide clean water access to rural communities' },
    { id: 'education', name: 'Digital Literacy Program', description: 'Empower through digital education' },
    { id: 'sustainability', name: 'Sustainability Projects', description: 'Environmental conservation efforts' }
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

  const handleDonation = async () => {
    const amount = getFinalAmount();
    if (amount <= 0) {
      alert('Please select or enter a valid donation amount');
      return;
    }
    try {
      trackEvent({ name: 'donation_initiated', properties: { amount, donationType, project: selectedProject } });
      const result = await processDonation({ amount: Math.round(amount * 100), currency: 'USD', donorEmail: donorInfo.email, projectId: selectedProject, recurring: donationType === 'recurring', method: 'card' });
      trackEvent({ name: 'donation_processed', properties: { status: result.status, amount } });
      await sendNotification({ title: 'Donation Received', message: `Thank you for your donation of $${amount}!`, recipients: [donorInfo.email || 'anonymous'], channel: ['email'] });
      alert(`Donation succeeded! Payment ID: ${result.id}`);
    } catch (e: any) {
      trackEvent({ name: 'donation_failed', properties: { amount, error: e.message } });
      alert('Donation failed: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            {t('donation.title', 'Make a Difference Today')}
          </h1>
          <p className="text-text-secondary text-lg">
            Your support helps us create lasting change in communities worldwide.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="bg-primary-light rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">$25</div>
              <div className="text-text-secondary text-sm">Provides clean water for 1 person for 1 month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">$100</div>
              <div className="text-text-secondary text-sm">Funds digital literacy training for 5 students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">$500</div>
              <div className="text-text-secondary text-sm">Supports a complete community project</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Your Donation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Donation Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      donationType === 'one-time'
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border hover:bg-background-light'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType('recurring')}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      donationType === 'recurring'
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border hover:bg-background-light'
                    }`}
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
                  Amount (USD)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border hover:bg-background-light'
                      }`}
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
                  Support
                </label>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full p-4 rounded-lg border text-left transition-colors ${
                        selectedProject === project.id
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:bg-background-light'
                      }`}
                    >
                      <div className="font-medium text-text-primary">{project.name}</div>
                      <div className="text-text-secondary text-sm">{project.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Donation Summary */}
              <div className="bg-background-light p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-primary">
                    {donationType === 'recurring' ? 'Monthly' : 'One-time'} donation:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${getFinalAmount()}
                  </span>
                </div>
                <div className="text-text-secondary text-sm mt-1">
                  Supporting: {projects.find(p => p.id === selectedProject)?.name}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Donor Information</CardTitle>
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
              <div className="bg-background-light p-4 rounded-lg">
                <div className="text-sm text-text-secondary">
                  <strong>Tax Deductible:</strong> Your donation is tax-deductible to the full extent allowed by law. 
                  You will receive a receipt via email for your records.
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handleDonation}
                className="w-full text-lg py-3"
                disabled={getFinalAmount() <= 0}
              >
                Donate ${getFinalAmount()} with Stripe
              </Button>

              <div className="text-center text-xs text-text-secondary">
                Secure payment processing by Stripe<br />
                <span className="inline-flex items-center gap-1"><Lock size={14} /> Your information is safe and encrypted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Ways to Help */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            Other Ways to Support
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Users className="w-10 h-10 mx-auto text-primary/70" /></div>
                <h3 className="font-bold text-text-primary mb-2">Volunteer</h3>
                <p className="text-text-secondary mb-4">
                  Share your skills and time to support our projects directly.
                </p>
                <Button variant="secondary">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Megaphone className="w-10 h-10 mx-auto text-primary/70" /></div>
                <h3 className="font-bold text-text-primary mb-2">Spread the Word</h3>
                <p className="text-text-secondary mb-4">
                  Help us reach more people by sharing our mission on social media.
                </p>
                <Button variant="secondary">Share</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Building2 className="w-10 h-10 mx-auto text-primary/70" /></div>
                <h3 className="font-bold text-text-primary mb-2">Corporate Partnership</h3>
                <p className="text-text-secondary mb-4">
                  Partner with us for corporate social responsibility initiatives.
                </p>
                <Button variant="secondary">Contact Us</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-6">
              <h3 className="font-bold text-text-primary mb-2">Transparency Promise</h3>
              <p className="text-text-secondary">
                We believe in complete transparency. Track how your donation is used through our 
                detailed project reports and impact tracking system.
              </p>
              <Button variant="secondary" className="mt-4">
                View Transparency Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
