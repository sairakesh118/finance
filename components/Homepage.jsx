import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  TrendingUp, 
  CreditCard,
  PieChart,
  Wallet,
  Target,
  Brain,
  Lock,
  Smartphone,
  Globe
} from 'lucide-react';

export default function Homepage() {
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 mb-10 flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <span className="bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-lg mr-3">
              <Zap className="w-4 h-4" />
            </span>
            <p className="text-white text-sm font-medium">
              Limited time: Get 3 months free premium + AI insights with annual plan!
            </p>
          </div>
          <button className="text-white text-sm hover:underline flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all hover:bg-white/20">
            Claim offer <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 px-4 py-2 rounded-full shadow-sm">
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="bg-gradient-to-r from-emerald-700 to-blue-700 text-transparent bg-clip-text text-sm font-semibold">
                  #1 AI-Powered Finance Platform
                </span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight">
                <span className="block text-slate-800">Master Your Money with</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  FinanceFlow Pro
                </span>
              </h1>
              
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                Revolutionary finance platform that combines intelligent transaction management, AI-powered insights, and multi-account orchestration. Transform your financial data into actionable strategies with beautiful, real-time analytics.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => navigate("/dashboard")} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-xl text-white font-semibold transition-all flex items-center gap-3 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-slate-300 hover:border-slate-400 px-8 py-4 rounded-xl text-slate-700 font-semibold transition-all hover:bg-slate-50 flex items-center gap-3">
                <PieChart className="w-5 h-5" />
                View Demo
              </button>
            </motion.div>
            
            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { icon: <Brain className="w-4 h-4" />, text: "AI Financial Insights" },
                { icon: <Lock className="w-4 h-4" />, text: "Bank-Level Security" },
                { icon: <Smartphone className="w-4 h-4" />, text: "Mobile & Desktop" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600">
                  <div className="text-blue-600">{feature.icon}</div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Background effects */}
              <div className="absolute -top-10 -left-10 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-60" />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-2xl opacity-50" />
              </div>

              {/* Main dashboard mockup */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-lg font-semibold">FinanceFlow Dashboard</div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Balance Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                      <div className="text-sm opacity-90">Total Balance</div>
                      <div className="text-2xl font-bold">$47,892</div>
                      <div className="text-xs opacity-80 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12.3% this month
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-xl text-white">
                      <div className="text-sm opacity-90">Monthly Savings</div>
                      <div className="text-2xl font-bold">$3,247</div>
                      <div className="text-xs opacity-80">+$450 vs last month</div>
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-sm font-semibold text-slate-700 mb-3">Spending Analytics</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Food & Dining</span>
                        <span className="text-xs font-medium">$1,234</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Transportation</span>
                        <span className="text-xs font-medium">$890</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6"
              >
                <div className="bg-white shadow-xl rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Smart Budgeting</p>
                    <p className="text-xs text-slate-500">AI-powered goal tracking</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-6 -right-6"
              >
                <div className="bg-white shadow-xl rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Live Analytics</p>
                    <p className="text-xs text-slate-500">Real-time insights</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-20"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  value: "2.8M+", 
                  label: "Transactions Processed", 
                  icon: <CreditCard className="w-6 h-6 text-blue-600" />,
                  gradient: "from-blue-100 to-blue-50"
                },
                { 
                  value: "847K+", 
                  label: "Active Users", 
                  icon: <Users className="w-6 h-6 text-emerald-600" />,
                  gradient: "from-emerald-100 to-emerald-50"
                },
                { 
                  value: "94.7%", 
                  label: "Savings Goal Success", 
                  icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
                  gradient: "from-purple-100 to-purple-50"
                },
                { 
                  value: "50+", 
                  label: "Bank Integrations", 
                  icon: <Globe className="w-6 h-6 text-orange-600" />,
                  gradient: "from-orange-100 to-orange-50"
                }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="text-center space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                >
                  <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        
      </div>
    </div>
  );
}