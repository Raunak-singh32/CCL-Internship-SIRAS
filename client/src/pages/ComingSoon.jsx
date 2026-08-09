import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Construction,
  ArrowLeft,
  Bell,
  Smartphone,
  Brain,
  Globe,
  WifiOff,
  Languages,
  FileBarChart,
  ShieldCheck,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: Bell,
    title: 'SMS & Email Alerts',
    desc: 'Instant notifications for critical incidents to safety officers and management.'
  },
  {
    icon: Smartphone,
    title: 'Mobile Field App',
    desc: 'Android/iOS app for offline incident reporting directly from mines.'
  },
  {
    icon: Brain,
    title: 'AI Risk Prediction',
    desc: 'Machine learning models to predict high-risk zones based on historical data.'
  },
  {
    icon: Globe,
    title: 'DGMS Portal Integration',
    desc: 'Direct data sync with DGMS online reporting portal for compliance.'
  },
  {
    icon: WifiOff,
    title: 'Offline Mode',
    desc: 'Report incidents without internet; auto-sync when connection resumes.'
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    desc: 'Hindi and English interfaces for wider workforce adoption.'
  },
  {
    icon: FileBarChart,
    title: 'Advanced BI Reports',
    desc: 'Power BI style interactive dashboards with drill-down capabilities.'
  },
  {
    icon: ShieldCheck,
    title: 'IoT Sensor Feed',
    desc: 'Real-time gas levels, temperature, and ventilation data integration.'
  }
];

export default function ComingSoon() {
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex items-center gap-3 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Construction size={20} className="text-yellow-400" />
            SIRAS-CCL Roadmap
          </h1>
          <p className="text-blue-200 text-xs">Central Coalfields Limited — Mine Safety System</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Clock size={40} className="text-blue-700" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Coming Soon{dots}
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            We are continuously improving SIRAS to make mine safety reporting smarter, faster, and more accessible. Here is what is next on our roadmap.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Internship Phase 2 — In Progress
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                  <Icon size={24} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
                  <Construction size={12} />
                  Under Development
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            Have a feature suggestion? Contact the internship team at CCL HQ, Ranchi.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}