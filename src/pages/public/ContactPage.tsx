import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, MessageCircle, User } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name:'', email:'', subject:'', message:'', type:'general' });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent!');
    setFormData({ name:'', email:'', subject:'', message:'', type:'general' });
  };

  return (
    <PublicPageShell>
      {/* Header */}
      <header className="space-y-2 mb-8">
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">Get in touch with the team</h1>
        <p className="text-[14px] leading-[20px] text-secondary max-w-prose">Questions about projects, partnerships, volunteering, donations, or media? Reach out—we respond to every message.</p>
      </header>

      {/* Main grid */}
      <section className="rounded-xl border border-base bg-white p-6 lg:p-8 mb-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-[760px]">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-medium text-secondary">Name *</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" className="h-10 px-3 rounded-full border border-base text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-medium text-secondary">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" className="h-10 px-3 rounded-full border border-base text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-secondary">Inquiry Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="h-10 px-3 rounded-full border border-base text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white">
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="donation">Donation</option>
                    <option value="media">Media</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-secondary">Subject *</label>
                  <input name="subject" value={formData.subject} onChange={handleInputChange} required placeholder="Brief subject" className="h-10 px-3 rounded-full border border-base text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-secondary">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6} placeholder="Your message..." className="px-3 py-2 rounded-xl border border-base text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none bg-white" />
                </div>
                <button type="submit" className="px-6 h-10 rounded-full border border-base text-[13px] font-medium inline-flex items-center gap-2 hover:bg-[var(--color-primary-light)]"><Send className="w-4 h-4" /> Send Message</button>
              </form>

              {/* Side Info */}
              <aside className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-[16px] leading-[22px] font-semibold text-primary">Contact details</h2>
                  <div className="space-y-4 text-[13px] leading-[20px] text-secondary">
                    <div className="flex gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-primary">Contact person & role</div>
                        <div className="text-secondary">Jessica Luiru — Founder & Program Director</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-primary">Email</div>
                        <div className="text-secondary"><a className="underline" href="mailto:luirujessica@gmail.com">luirujessica@gmail.com</a></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-primary">Phone</div>
                        <div className="text-secondary"><a className="underline" href="tel:+14439751470">+1 443-975-1470</a></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-primary">Address</div>
                        <div className="text-secondary">
                          HQ in Dunkirk, Maryland, USA<br/>
                          Province/State: Maryland (USA)<br/>
                          Territory/District: HQ: Dunkirk
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-base p-4 bg-[var(--color-primary-light)]">
                  <h3 className="text-[14px] leading-[20px] font-semibold text-primary mb-2">Office Hours</h3>
                  <ul className="text-[12px] leading-[18px] text-primary-dark space-y-1">
                    <li className="flex justify-between"><span>Mon–Fri</span><span>09:00–18:00</span></li>
                    <li className="flex justify-between"><span>Saturday</span><span>10:00–16:00</span></li>
                    <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
                  </ul>
                </div>
                {/* Social links */}
                <div className="rounded-xl border border-base p-4 bg-white">
                  <h3 className="text-[14px] leading-[20px] font-semibold text-primary mb-3">Follow & share</h3>
                  <ul className="flex flex-wrap gap-2">
                    {[ 
                      { href:'https://facebook.com', label:'Facebook', icon:<Facebook className="w-4 h-4" /> },
                      { href:'https://twitter.com', label:'Twitter / X', icon:<Twitter className="w-4 h-4" /> },
                      { href:'https://wa.me/123456789', label:'WhatsApp', icon:<MessageCircle className="w-4 h-4" /> },
                      { href:'https://instagram.com', label:'Instagram', icon:<Instagram className="w-4 h-4" /> },
                      { href:'https://tiktok.com/@youraccount', label:'TikTok', icon:<span className="text-[11px] font-semibold">♫</span> },
                      { href:'https://linkedin.com/company/yourpage', label:'LinkedIn', icon:<Linkedin className="w-4 h-4" /> }
                    ].map(s => (
                      <li key={s.label}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-base text-primary hover:bg-[var(--color-primary-light)] transition">
                          {s.icon}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-4">
        <div className="rounded-xl border border-base bg-white p-6 space-y-4 text-center">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary">Partner with us to advance menstrual dignity and education.</h2>
          <Link to="/donate" className="btn-donate inline-flex justify-center">Donate</Link>
        </div>
      </section>
    </PublicPageShell>
  );
};

export default ContactPage;
