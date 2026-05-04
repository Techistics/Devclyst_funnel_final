import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ChevronDown,
  Instagram,
  Facebook,
  Bot,
  Smartphone,
  Check,
  Phone,
  Layout,
  Star,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-full px-5 md:px-8 h-16 flex items-center justify-between shadow-2xl shadow-slate-200/50 relative transition-all duration-300">
        {/* Left Links - Desktop */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <a href="#packages" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Prebuilt</a>
          <a href="#book-form" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Customized</a>
        </div>
        
        {/* Logo - Center */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xl font-black tracking-tight text-slate-900">DEV</span>
          <span className="text-xl font-black tracking-tight text-brand">CLYST</span>
        </div>

        {/* Right Links - Desktop */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
          <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">About Us</a>
          <a href="https://wa.me/923704640009" target="_blank" className="text-sm font-semibold text-slate-600 hover:text-brand transition-colors">Contact Us</a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-brand transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-20 left-0 right-0 bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl md:hidden flex flex-col gap-4 text-center z-[60]"
            >
              <div className="flex flex-col gap-1">
                {[
                  { name: 'Prebuilt', href: '#packages' },
                  { name: 'Customized', href: '#book-form' },
                  { name: 'About Us', href: '#how-it-works' },
                  { name: 'Contact Us', href: 'https://wa.me/923704640009', primary: true }
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      link.primary 
                      ? 'bg-brand text-white shadow-lg shadow-teal-100 mt-2' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const FloatingBadge = ({ icon: Icon, text, className, colorClass = "text-emerald-500 bg-emerald-50" }: { icon: any, text: string, className?: string, colorClass?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`absolute z-10 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 ${className}`}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon className="w-4 h-4 fill-current" />
    </div>
    <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{text}</span>
  </motion.div>
);

const ConsultationForm = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [seenWork, setSeenWork] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      document.getElementById('book-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSuccess]);

  const validateWhatsApp = (num: string) => {
    const regex = /^\+?[0-9]{10,15}$/;
    return regex.test(num.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !whatsapp || !selectedPackage || !selectedTime || !seenWork) {
      setError('Please fill in all fields to proceed.');
      return;
    }

    if (!validateWhatsApp(whatsapp)) {
      setError('Please enter a valid WhatsApp number (e.g. 03001234567)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          whatsapp,
          package: selectedPackage,
          timeline: selectedTime,
          seenWork,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.errors ? data.errors[0].message : 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Error connecting to server. Please check your internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="book-form" className="py-24 bg-green-50 min-h-[80vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-slate-100"
          >
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-12 h-12 text-brand stroke-[3]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Booking Received!</h2>
            <p className="text-slate-600 text-lg font-medium mb-10 leading-relaxed">
              Thank you, <span className="text-brand font-bold">{name.split(' ')[0]}</span>. <br className="hidden sm:block" />
              We'll reach out to you on WhatsApp within the next 24 hours to confirm your consultation.
            </p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="w-full sm:w-auto px-10 py-5 bg-brand text-white rounded-2xl font-black text-lg shadow-xl shadow-teal-100 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Back to Website
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="book-form" className="py-24 bg-green-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase mb-6">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Only 7 slots open this month
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Book Your Free Consultation</h2>
          <p className="text-slate-500 font-medium">15-minute WhatsApp call. No payment now. No commitment.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-100 text-red-600 px-5 py-3 rounded-xl text-sm font-bold text-center mb-4"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmed Khan"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">WhatsApp Number</label>
              <input 
                type="tel" 
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 0300 1234567"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Which package interests you?</label>
              <div className="grid grid-cols-1 gap-3">
                {['Starter — Rs. 14,999', 'Complete — Rs. 19,999', 'Not sure yet'].map((pkg) => (
                  <button
                    key={pkg}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`text-left px-5 py-4 rounded-2xl border transition-all font-medium ${
                      selectedPackage === pkg 
                      ? 'bg-brand border-brand text-white shadow-lg shadow-teal-100' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">Have you seen our working chatbots and website for other businesses?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSeenWork(opt.toLowerCase())}
                    className={`text-center px-5 py-4 rounded-2xl border transition-all font-bold ${
                      seenWork === opt.toLowerCase() 
                      ? 'bg-brand border-brand text-white shadow-lg shadow-teal-100' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">How soon do you want to start?</label>
              <div className="flex flex-wrap gap-2">
                {['This week', 'This month', 'Just exploring'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-6 py-3 rounded-full border text-sm font-bold transition-all ${
                      selectedTime === time 
                      ? 'bg-brand border-brand text-white' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer w-full py-5 bg-brand text-white rounded-2xl font-black text-lg shadow-xl shadow-teal-100 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Book My Free Consultation'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              NO SPAM. WE ONLY CONTACT YOU ON WHATSAPP.
            </div>
          </form>
        </motion.div>

        <div className="mt-8 text-center">
          <a 
            href="https://wa.me/923704640009" 
            className="text-brand font-bold text-sm hover:underline flex items-center justify-center gap-2"
          >
            Prefer to message directly? WhatsApp us now
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors group"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-brand transition-colors">
      <Icon className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </motion.div>
);

const PricingCard = ({ 
  tier, 
  title, 
  price, 
  desc, 
  features, 
  popular = false, 
  cta,
  badge
}: { 
  tier: string, 
  title: string, 
  price: string, 
  desc: string, 
  features: (string | { text: string, check: boolean })[], 
  popular?: boolean,
  cta: string,
  badge?: string
}) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className={`relative p-8 rounded-3xl border-2 flex flex-col h-full ${
      popular ? 'border-brand shadow-2xl shadow-teal-100 bg-white' : 'border-slate-100 bg-white'
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand text-white text-[12px] font-bold rounded-lg tracking-wider uppercase shadow-md whitespace-nowrap">
        ⭐ Most Popular & Best Value
      </div>
    )}
    <div className="mb-6">
      <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">{tier}</span>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-black text-slate-900">{price}</span>
      </div>
      <p className="text-slate-400 text-xs font-bold mb-4 uppercase tracking-wider">One-time setup fee</p>
      <p className="text-slate-600 text-sm font-medium">{desc}</p>
    </div>

    {badge && (
      <div className="mb-6 bg-teal-50 rounded-xl p-3 border border-teal-100">
        <p className="text-[12px] text-teal-900 font-bold text-center">
          {badge}
        </p>
      </div>
    )}

    <div className="space-y-4 mb-10 flex-grow">
      {features.map((f, i) => {
        const isObject = typeof f === 'object';
        const text = isObject ? f.text : f;
        const check = isObject ? f.check : true;
        
        return (
          <div key={i} className="flex gap-3 text-[14px] items-start">
            {check ? (
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${popular ? 'text-brand' : 'text-emerald-500'}`} />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-slate-200 rotate-45 absolute" />
                  <div className="w-2 h-0.5 bg-slate-200 -rotate-45 absolute" />
                </div>
              </div>
            )}
            <span className={check ? 'text-slate-700 font-medium' : 'text-slate-400'}>{text}</span>
          </div>
        );
      })}
    </div>
    <a 
      href="#book-form"
      onClick={() => {
        document.getElementById('book-form')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`w-full py-4 rounded-xl font-bold text-center transition-all active:scale-95 flex items-center justify-center gap-2 ${
        popular ? 'bg-brand text-white hover:opacity-90 shadow-lg shadow-teal-100' : 'bg-white border-2 border-brand text-brand hover:bg-teal-50'
      }`}
    >
      {cta}
      <ArrowRight className="w-4 h-4" />
    </a>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-semibold text-slate-900 group-hover:text-brand transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const scrollToForm = () => {
    document.getElementById("book-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-700">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-28 md:pt-[60px] pb-16 px-5 md:px-10 bg-white overflow-hidden min-h-0 flex items-center justify-center">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />

        <div className="relative z-10 max-w-[1000px] mx-auto text-center flex flex-col items-center">
          
          {/* 1. Photo Block (Glow + Grid + Floating Cards) */}
          <div className="relative w-full max-w-[500px] mb-4 flex justify-center items-center overflow-visible">
            {/* Radial Glow Behind Photo */}
            <div 
              className="absolute inset-0 -z-10 translate-y-10"
              style={{
                background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)",
              }}
            />
            
            {/* Blurred Circle Background */}
            <div className="absolute w-[300px] h-[300px] bg-[#0D9488]/[0.08] blur-[60px] rounded-full -z-10" />

            {/* Main Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="relative z-10 w-full"
            >
              <img 
                src="/hero-image.png" 
                alt="DevClyst Founders" 
                className="w-full h-auto drop-shadow-2xl object-contain max-h-[280px] md:max-h-[340px]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback placeholder */}
              <div className="hidden aspect-square w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                 <span className="text-sm">Founders Image</span>
                 <code className="text-[10px] mt-2">public/hero-image.png</code>
              </div>
            </motion.div>

            {/* Floating Card 1: Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [-6, 6]
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.4, ease: "easeOut" },
                x: { duration: 0.5, delay: 0.4, ease: "easeOut" },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              }}
              className="hidden md:flex absolute left-[-60px] top-1/4 z-20 bg-white border border-[#E5E7EB] rounded-[12px] py-[10px] px-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center gap-2 whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-[#CCFBF1] flex items-center justify-center">
                 <svg className="w-3 h-3 text-[#0D9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-[13px] font-semibold text-gray-800">50+ Businesses Launched</span>
            </motion.div>

            {/* Floating Card 2: Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [6, -6]
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.4, ease: "easeOut" },
                x: { duration: 0.5, delay: 0.4, ease: "easeOut" },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              }}
              className="hidden md:flex absolute right-[-60px] bottom-1/4 z-20 bg-white border border-[#E5E7EB] rounded-[12px] py-[10px] px-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center gap-2 whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-[#FEF9C3] flex items-center justify-center">
                 <svg className="w-3 h-3 text-[#CA8A04]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
              </div>
              <span className="text-[13px] font-semibold text-gray-800">7 Day Delivery</span>
            </motion.div>

            {/* Floating Card 3: Bottom Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [4, -4]
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.5, ease: "easeOut" },
                x: { duration: 0.5, delay: 0.5, ease: "easeOut" },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              }}
              className="hidden md:flex absolute left-[-60px] bottom-1/4 z-20 bg-white border border-[#E5E7EB] rounded-[12px] py-[10px] px-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center gap-2 whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-[#FEF9C3] flex items-center justify-center">
                 <svg className="w-3.5 h-3.5 text-[#EAB308]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
              <span className="text-[13px] font-semibold text-gray-800">5★ Client Rating</span>
            </motion.div>

            {/* Floating Card 4: Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [-4, 4]
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.5, ease: "easeOut" },
                x: { duration: 0.5, delay: 0.5, ease: "easeOut" },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              }}
              className="hidden md:flex absolute right-[-60px] top-1/4 z-20 bg-white border border-[#E5E7EB] rounded-[12px] py-[10px] px-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center gap-2 whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-[#DCF8C6] flex items-center justify-center">
                 <svg className="w-3.5 h-3.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path></svg>
              </div>
              <span className="text-[13px] font-semibold text-gray-800">WhatsApp Support 24/7</span>
            </motion.div>
          </div>

          {/* 2. H1 Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-[22px] sm:text-[28px] md:text-[40px] lg:text-[52px] font-bold leading-[1.1] text-gray-900 tracking-tight mb-4 max-w-full"
          >
            Every day offline is a <span className="text-[#0D9488]">lost customer.</span>
          </motion.h1>

          {/* 3. Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-[16px] md:text-[20px] text-gray-500 font-medium leading-[1.5] max-w-[600px] mb-4"
          >
            Website. WhatsApp Chatbot. Social Pages. Done in 7 days.
          </motion.p>

          {/* 4. CTA Button + Trust Micro-copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            <button 
              onClick={scrollToForm}
              className="w-full md:w-auto min-w-[320px] cursor-pointer h-[40px] bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-[14px] text-[19px] font-bold tracking-wide transition-all transform hover:-translate-y-[2px] flex items-center justify-center shadow-xl shadow-teal-900/20"
            >
              Get Our Free Consultation →
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. Video Section */}
      <section id="how-it-works" className="py-12 md:py-16 bg-[#0D9488] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">See How It Works</h2>
            <p className="text-white text-sm md:text-base font-medium">A quick 2-minute walkthrough of our automated growth system.</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video w-full rounded-[1.5rem] md:rounded-[2.5rem] bg-black shadow-2xl overflow-hidden border-4 md:border-8 border-white/10 relative"
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/Zu38BqyKFYo?rel=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Work Section */}
      <section id="portfolio" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Real Businesses. Real Results.</h2>
              <p className="text-lg text-slate-600">See how we've helped local businesses transition from offline to digital leaders.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                name: "Zaras Salon",
                loc: 'Lahore',
                type: 'Salon',
                img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop',
                link: "https://zara-nine-nu.vercel.app/"
              },
              {
                name: 'Dawat-e-Zouq',
                loc: 'Karachi',
                type: 'Restaurant',
                img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
                link: "https://dawat-e-zouq.vercel.app/"
              }
            ].map((client, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-100"
              >
                <img src={client.img} alt={client.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded uppercase tracking-wider">{client.type}</span>
                    <span className="text-white/60 text-xs font-medium">• {client.loc}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{client.name}</h3>
                  <a 
                    href={client.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-white font-semibold text-sm hover:text-teal-300 transition-colors"
                  >
                    Visit Project <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Plans Section */}
      <section id="packages" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Choose Your Package</h2>
            <p className="text-lg text-slate-600">Both include everything to get you online. One goes further.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            <PricingCard 
              tier="Starter"
              title="Essential Setup"
              price="Rs. 14,999"
              desc="Get online. Start getting found."
              cta="Get Started"
              features={[
                { text: "Free domain", check: true },
                { text: "1-page professional website", check: true },
                { text: "WhatsApp Business setup", check: true },
                { text: "Basic chatbot (limited messages/month)", check: true },
                { text: "Facebook Business Page setup", check: true },
                { text: "Instagram Business Page setup", check: true },
                { text: "Paid domain (not included)", check: false },
                { text: "Multi-page website", check: false },
                { text: "Google Business Profile", check: false },
                { text: "Priority support", check: false },
                { text: "3 months free support", check: false },
              ]}
            />
            <PricingCard 
              popular
              tier="Complete"
              title="Growth Engine"
              price="Rs. 19,999"
              desc="More reach. More automation. More growth."
              cta="Get Started"
              badge="Includes 3 months free support — worth Rs. 7,500"
              features={[
                "Paid domain (.com) — yours to keep",
                "Multi-page website (Home, About, Services, Contact)",
                "WhatsApp Business setup",
                "Advanced chatbot (order booking + auto-replies)",
                "Facebook Business Page setup",
                "Instagram Business Page setup",
                "Google Business Profile setup",
                "3 months free support (calls + fixes)",
                "Priority delivery (5 days, not 7)",
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. Form Section */}
      <ConsultationForm />

      {/* 6. Detailed Comparison Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight">Transparent Pricing - No Hidden Charges</h2>
            <p className="text-lg text-slate-500 font-medium">Compare our packages in detail and choose what fits your business best.</p>
          </div>

          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl">
            <table className="w-full bg-white text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-6 text-sm font-bold uppercase tracking-wider">Features</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-wider text-center">Starter</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-wider text-center bg-brand/10 text-brand">Complete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { f: 'Custom Domain', s: 'Lite (.my.pk)', c: 'Paid (.com/.pk)' },
                  { f: 'Website Pages', s: '1-Page', c: 'Multi-Page' },
                  { f: 'WhatsApp Bot', s: 'Basic Replies', c: 'Order Booking' },
                  { f: 'Delivery Time', s: '7 Days', c: '5 Days (Priority)' },
                  { f: 'Google Business', s: '❌', c: '✅ Setup Included' },
                  { f: 'Support Duration', s: '3 Days Revisions', c: '3 Months Priority' },
                  { f: 'Monthly Fees', s: '1500 PKR/-', c: '2500 PKR/-' },
                  { f: 'Ownership', s: '100% Yours', c: '100% Yours' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 text-slate-700 font-bold text-sm bg-slate-50/30">{row.f}</td>
                    <td className="p-6 text-center text-slate-600 text-sm">{row.s}</td>
                    <td className="p-6 text-center text-brand font-black text-sm bg-brand/5">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-12 p-8 rounded-3xl bg-teal-50 border border-teal-100 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Zap className="text-brand w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-slate-800 font-bold">Ready to take your business to the next level?</p>
                <p className="text-slate-500 text-sm font-medium">Complete the form below to secure your slot and start your 7-day delivery countdown.</p>
              </div>
            </div>
            <button 
              onClick={scrollToForm}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-brand text-white rounded-xl font-bold text-sm shadow-xl shadow-brand/20 hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Book My Slot Now →
            </button>
          </div>
        </div>
      </section>

      {/* 7. Process Section */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">3 Simple Steps to Scale</h2>
            <p className="text-slate-400 text-lg">We've streamlined our process to save you months of work.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 hidden md:block z-0" />
            
            {[
              { step: '01', title: 'Fill the Form', desc: 'Takes 2 mins. Tell us your business name, what you sell, and your goals.' },
              { step: '02', title: 'WhatsApp Discovery', desc: 'A 15-min call to confirm details. No commitment. We handle the heavy lifting.' },
              { step: '03', title: 'Go Live in 7 Days', desc: 'Your website, chatbot, and pages handed over. Start accepting customers.' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center text-3xl font-black text-brand mb-8 group-hover:bg-brand group-hover:text-white transition-all duration-500 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 8. FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Questions We Get Every Day</h2>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 divide-y divide-slate-100">
            <FAQItem 
              question="What do I need to provide?"
              answer="Almost nothing except your business name, phone number, and a basic idea of what you sell. We handle everything else: domain registration, web hosting setup, chatbot flow, and social page optimization."
            />
            <FAQItem 
              question="Are there any monthly fees?"
              answer="Yes, we charge a small monthly maintenance fee (1,500 PKR for Starter, 2,500 PKR for Complete). This covers your premium hosting, AI chatbot server costs, and ongoing technical support to ensure your business never goes offline."
            />
            <FAQItem 
              question="How long does the delivery take?"
              answer="Exactly 7 days. Our streamlined 'Funnel-First' process allows us to go from our discovery call to a live, functional launch in just one week. No months of waiting."
            />
            <FAQItem 
              question="Is the website mobile-friendly?"
              answer="Absolutely. Over 90% of Pakistani customers browse on mobile. Every website we build is mobile-first, ensuring a premium, fast-loading experience on all smartphones."
            />
            <FAQItem 
              question="Can the chatbot handle orders?"
              answer="Yes! Our Advanced Chatbot on the Complete plan can take order details, confirm prices, and notify you on your personal WhatsApp so you can fulfill them instantly."
            />
          </div>
        </div>
      </section>

      {/* 9. Final Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
               <span className="text-xl font-black tracking-tight text-slate-900">DEV</span>
               <span className="text-xl font-black tracking-tight text-brand">CLYST</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-brand transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand transition-colors">Terms</a>
              <a href="https://wa.me/923704640009" className="hover:text-brand transition-colors">WhatsApp Support</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-teal-50 transition-colors group">
                <Instagram className="w-4 h-4 text-slate-400 group-hover:text-brand" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-teal-50 transition-colors group">
                <Facebook className="w-4 h-4 text-slate-400 group-hover:text-brand" />
              </a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-50">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">© 2025 DevClyst · Pakistan's #1 Automation Studio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
