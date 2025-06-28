'use client';

import AppJsonLd from '../components/AppJsonLd';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  Clock, 
  Send, 
  ChevronDown,
  CheckCircle,
  Star,
  ArrowRight,
  Video,
  MessageCircle,
  FileText,
  Shield,
  BarChart2,
  CheckCheck,
  Sparkles,
  BarChart3,
  Zap,
  ChevronRight,
  Check,
  Play,
  Bell,
  Settings,
  Building2,
  HeadphonesIcon,
  Gavel,
  TrendingUp,
  Headphones,
  Upload,
  ShieldCheck,
  Mail,
  CreditCard,
  PieChart,
  Link,
  List,
  Target,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import Homepage from '@/components/Homepage';

const ParallaxBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-30">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/5 w-72 h-72 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
      </div>
    </div>
  );
};


const StepCard = ({ step, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
  
    const opacity = useTransform(
      scrollYProgress, 
      [0, 0.2, 0.8, 1], 
      [0.3, 1, 1, 0.3]
    );
  
    const scale = useTransform(
      scrollYProgress, 
      [0, 0.2, 0.8, 1], 
      [0.9, 1, 1, 0.9]
    );
  
    const translateX = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [index % 2 === 0 ? -70 : 70, 0, 0, index % 2 === 0 ? 70 : -70]
    );
  
    const rotate = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [index % 2 === 0 ? -3 : 3, 0, 0, index % 2 === 0 ? 3 : -3]
    );
  
    return (
      <motion.div 
        ref={ref}
        style={{ 
          opacity, 
          scale, 
          translateX,
          rotate
        }}
        className={`
          relative flex items-center w-full my-20
          ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}
        `}
      >
        <motion.div 
          className="absolute -left-16 md:-left-24 top-1/2 transform -translate-y-1/2 z-10"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
        >
          <div className="
            w-14 h-14 rounded-full 
            bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 
            flex items-center justify-center 
            text-xl font-bold 
            border-4 border-white 
            shadow-xl
          ">
            {step.number}
          </div>
        </motion.div>
        <div className="
          w-full md:w-4/6 
          bg-white 
          rounded-2xl 
          shadow-xl 
          p-4
          border-l-4 
          border-blue-500
          hover:shadow-2xl
          transition-all
          duration-300
          backdrop-blur-sm
          bg-opacity-90
        gap-2 flex flex-col">
          <div className="flex items-center gap-1">
            <div className="p-3 rounded-full bg-blue-50 mr-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 text-transparent bg-clip-text">
              {step.title}
            </h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
          <div className="flex items-center text-blue-600 font-semibold">
            <CheckCircle className="mr-2" />
            <span className="bg-blue-50 px-3 py-1 rounded-full">{step.benefit}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const FeatureCard = ({ feature, index, isActive, setActiveFeature }) => {
    const colors = {
      green: { light: 'bg-green-50', border: 'border-green-300', shadow: 'shadow-green-200/50' },
      emerald: { light: 'bg-emerald-50', border: 'border-emerald-300', shadow: 'shadow-emerald-200/50' },
      teal: { light: 'bg-teal-50', border: 'border-teal-300', shadow: 'shadow-teal-200/50' },
      lime: { light: 'bg-lime-50', border: 'border-lime-300', shadow: 'shadow-lime-200/50' },
      yellow: { light: 'bg-yellow-50', border: 'border-yellow-300', shadow: 'shadow-yellow-200/50' },
      cyan: { light: 'bg-cyan-50', border: 'border-cyan-300', shadow: 'shadow-cyan-200/50' },
      blue: { light: 'bg-blue-50', border: 'border-blue-300', shadow: 'shadow-blue-200/50' }
    };
    
    return (
      <motion.div 
        className={`
          p-3 rounded-2xl border-2 transition-all duration-300
          ${isActive 
            ? `bg-white shadow-2xl ${colors[feature.color].border} ${colors[feature.color].shadow}` 
            : 'bg-gray-50 border-transparent'}
          hover:bg-white hover:shadow-2xl
        `}
        onMouseEnter={() => setActiveFeature(index)}
        onMouseLeave={() => setActiveFeature(null)}
        whileHover={{ y: -10 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className={`flex items-center mb-6`}>
          <div className={`p-4 rounded-xl ${colors[feature.color].light} mr-4`}>
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold">{feature.title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
        <div className="mt-4 flex items-center text-green-600">
          <div className="bg-green-50 p-1 rounded-full mr-2">
            <CheckCheck className="w-5 h-5" />
          </div>
          <span className="font-medium">Verified Feature</span>
        </div>
      </motion.div>
    );
  };
  
  const TestimonialCard = ({ testimonial, index }) => {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.5 }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >

        <div className={`h-1.5 ${testimonial.rating >= 5 ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-400'}`} />
        
        <div className="p-6">
          <div className="flex mb-5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + i * 0.1 }}
              >
                <Star 
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                  fill={i < testimonial.rating ? '#facc15' : '#e5e7eb'} 
                />
              </motion.div>
            ))}
            
            {testimonial.rating === 5 && (
              <motion.div 
                className="ml-2 flex items-center text-blue-600 text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.6 }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </motion.div>
            )}
          </div>
          
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-2 text-blue-100 text-5xl font-serif">"</div>
            <p className="text-gray-700 text-lg leading-relaxed pt-2 pl-4 relative z-10">
              {testimonial.quote}
            </p>
            <div className="absolute -bottom-4 -right-2 text-blue-100 text-5xl font-serif">"</div>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              {testimonial.avatar ? (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div className="absolute -right-1 bottom-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <span>{testimonial.role}</span>
                {testimonial.company && (
                  <>
                    <div className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                    <span>{testimonial.company}</span>
                  </>
                )}
              </div>
            </div>
            {testimonial.date && (
              <div className="ml-auto text-xs text-gray-400">
                {testimonial.date}
              </div>
            )}
          </div>
        </div>
        
        {testimonial.tags && testimonial.tags.length > 0 && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {testimonial.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    );
  };
  

  const ScrollIndicator = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    
    useEffect(() => {
      const handleScroll = () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        setScrollPercentage(scrolled);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"
          style={{ width: `${scrollPercentage}%` }}
        ></div>
      </div>
    );
  };
  
const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate=useRouter();

  const features = [
  {
    icon: <BarChart2 className="w-10 h-10 text-green-600" />,
    title: "Smart Transaction Insights",
    description: "Get automatic categorization and analysis of your spending to uncover trends and save more.",
    color: "green"
  },
  {
    icon: <Bell className="w-10 h-10 text-emerald-600" />,
    title: "Real-Time Budget Alerts",
    description: "Receive instant notifications when you're nearing budget limits or unusual activity is detected.",
    color: "emerald"
  },
  {
    icon: <Calendar className="w-10 h-10 text-teal-600" />,
    title: "Scheduled Reports",
    description: "Get weekly and monthly financial summaries delivered straight to your inbox.",
    color: "teal"
  },
  {
    icon: <Zap className="w-10 h-10 text-lime-600" />,
    title: "AI-Powered Suggestions",
    description: "Let our AI recommend budget adjustments and financial goals based on your habits.",
    color: "lime"
  },
  {
    icon: <Mail className="w-10 h-10 text-yellow-600" />,
    title: "Email Summaries",
    description: "Stay in the loop with beautifully designed email reports of your key financial activities.",
    color: "yellow"
  },
  {
    icon: <CreditCard className="w-10 h-10 text-cyan-600" />,
    title: "Multi-Account Tracking",
    description: "Connect multiple bank accounts and credit cards to view all your transactions in one place.",
    color: "cyan"
  },
  {
    icon: <PieChart className="w-10 h-10 text-blue-600" />,
    title: "Visual Budget Charts",
    description: "Understand your income and expenses with interactive, easy-to-read visualizations.",
    color: "blue"
  },
  {
    icon: <Shield className="w-10 h-10 text-green-600" />,
    title: "Secure & Private",
    description: "We use bank-level encryption and privacy-first design to keep your financial data safe.",
    color: "green"
  }
];



 const steps = [
  {
    number: "1",
    title: "Connect Your Accounts",
    description: "Securely link your bank accounts and cards to begin tracking your financial activity.",
    benefit: "Unified View",
    icon: <Link className="w-6 h-6 text-green-600" />
  },
  {
    number: "2",
    title: "Track Transactions",
    description: "Automatically categorize your spending and income across all sources.",
    benefit: "Smarter Spending",
    icon: <List className="w-6 h-6 text-emerald-600" />
  },
  {
    number: "3",
    title: "Set Budgets & Goals",
    description: "Define monthly budgets and savings goals — get notified when you go over.",
    benefit: "Stay in Control",
    icon: <Target className="w-6 h-6 text-yellow-600" />
  },
  {
    number: "4",
    title: "Get Insights & Reports",
    description: "Receive AI-generated summaries and tips in-app and via email to improve financial habits.",
    benefit: "Actionable Insights",
    icon: <Activity className="w-6 h-6 text-blue-600" />
  },
  {
    number: "5",
    title: "Review & Adjust",
    description: "Check leaderboards, trends, and predictions to continuously optimize your finances.",
    benefit: "Ongoing Improvement",
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />
  }
];



  const testimonials = [
  {
    name: "Priya Mehta",
    role: "Freelancer",
    quote: "This app completely changed the way I manage money. I love the email summaries and smart alerts — they keep me on track effortlessly.",
    rating: 5
  },
  {
    name: "Arjun Sinha",
    role: "Working Professional",
    quote: "The charts and UI are top-notch! I can visualize my spending in seconds and the AI tips are surprisingly accurate.",
    rating: 5
  },
  {
    name: "Neha Desai",
    role: "Startup Founder",
    quote: "I manage multiple accounts and this is the only app that handles it cleanly. The budgeting feature alone is worth it.",
    rating: 4
  },
  {
    name: "Rohan Agarwal",
    role: "Graduate Student",
    quote: "Thanks to this app, I finally got serious about budgeting. The real-time alerts are a lifesaver for managing my limited income.",
    rating: 5
  }
];



  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(
    heroScrollProgress, 
    [0, 1], 
    [1, 0]
  );
  
  const heroTranslateY = useTransform(
    heroScrollProgress, 
    [0, 1], 
    [0, 100]
  );

  const faqs = [
  {
    question: "How do I list a product for auction?",
    answer: "You can list a product by filling out a simple form with item details, setting a starting bid, and choosing the auction duration. Bulk upload via CSV is also supported for power sellers."
  },
  {
    question: "Is bidding in real-time?",
    answer: "Yes, all auctions are conducted in real-time. You'll see live bid updates, and notifications are sent for each outbid, win, or major event."
  },
  {
    question: "What happens when I win an auction?",
    answer: "When you win, you’ll receive a confirmation and be redirected to a secure checkout page to complete your payment. The seller will then prepare your item for delivery."
  },
  {
    question: "Is my payment and personal data secure?",
    answer: "Absolutely. Our platform uses bank-level encryption, secure payment gateways, and two-factor authentication to keep your data safe and compliant with regulations."
  },
  {
    question: "Can I track the performance of my listings?",
    answer: "Yes, our dashboard offers detailed analytics on bids, views, and conversions so you can optimize your listings and maximize results."
  },
  {
    question: "What if someone places a last-second bid?",
    answer: "We use smart auction extensions to prevent sniping. If a bid is placed near the end, the auction time is automatically extended to ensure fairness."
  },
  {
    question: "Can multiple users manage the same seller account?",
    answer: "Yes, we support multi-user access with role-based permissions, making it easy for teams to collaborate on auction management."
  }
];

  const FAQItem = ({ faq, isOpen, toggleFAQ }) => {
    return (
      <motion.div 
        className="border-b border-gray-200 py-5 w-full flex flex-col justify-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <button 
          className="flex justify-between items-center w-full text-left focus:outline-none"
          onClick={toggleFAQ}
        >
          <h4 className="text-xl font-medium text-gray-900">{faq.question}</h4>
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="text-blue-500" />
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="pt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <AppJsonLd 
        app={{
            name: "Finance Manager",
            description: "Effortless bulk messaging and customer engagement platform for WhatsApp Business users.",
            rating: 4.8,
            users: 3500
          }} 
      />
      <div className="bg-gradient-to-b from-gray-50 to-white">
       
        <ScrollIndicator />
        <ParallaxBackground />
         <Homepage />
        <div className="container mx-auto px-4 py-14">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold mb-4 text-sm">
              POWERFUL FEATURES
            </span>
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
            Effortless Customer Messaging, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text"> Automated for Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
             Reach your customers instantly with AI-powered WhatsApp automation. Send bulk messages, schedule promotions, and engage customers effortlessly—all in one powerful tool. 🚀
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                setActiveFeature={setActiveFeature}
              />
            ))}
          </div>
        </div>

        <div className=" bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 -z-10 opacity-20"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold  text-sm">
                SIMPLIFIED PROCESS
              </span>
              <h2 className="text-4xl md:text-4xl font-bold text-gray-900 ">
                How <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Finance Manager Works</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A Simple, Intuitive Process That Transforms Messaging into a Seamless Experience.
              </p>
            </motion.div>
            <div className="relative max-w-5xl mx-auto pl-16 md:pl-24">
      
              <motion.div 
                className="absolute top-0 bottom-0 left-0 md:left-8 w-1 bg-gradient-to-b from-blue-300 to-blue-600"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />

              {steps.map((step, index) => (
                <StepCard 
                  key={index} 
                  step={step} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-4 text-sm">
              SUCCESS STORIES
            </span>
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses and professionals who have revolutionized customer engagement with Finance Manager. 🚀
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className=" ">
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about Qfloo WhatsApp Manager and discover how it can streamline your customer messaging and engagement.
            </p>
          </motion.div>
          <div className="max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                faq={faq}
                isOpen={openFAQ === index}
                toggleFAQ={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        
        </div>
      </div>
    </>
  );
};

export default LandingPage;

     