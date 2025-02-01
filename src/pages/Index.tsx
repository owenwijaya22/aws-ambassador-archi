import { useEffect } from "react";
import { BoxIcon } from 'lucide-react'; 
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { 
  RocketIcon,
  UploadCloudIcon,
  RefreshCwIcon,
  Trash2Icon,
  TrendingUpIcon, 
  DatabaseIcon, 
  CloudIcon,
  GlobeIcon,
  ServerIcon,
  Zap,
  RefreshCcw,
  ArrowRightIcon
} from "lucide-react";

// API endpoints
const COUNTER_API = "https://dyq8814cgc.execute-api.us-east-1.amazonaws.com/production/counter";
const TRENDS_API = "https://dyq8814cgc.execute-api.us-east-1.amazonaws.com/production/trends";

interface CounterData {
  total_visits: number;
  today_visits: number;
}

interface TrendData {
  visits: number;
  pageId: string;
}

const AnimatedTitle = () => {
  return (
    <div className="text-center space-y-4 mb-12">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-2xl animate-pulse rounded-full" />
        
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 group">
          {/* Animated Rocket */}
          <div className="relative">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md animate-pulse" />
            <RocketIcon className="w-12 h-12 text-blue-400 animate-bounce-slow transform hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Title with gradient and animation */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
              Owen's AWS Infra
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-150" />
          </h1>
        </div>

        {/* Subtitle with live indicator */}
        <div className="relative mt-6">
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Modern Cloud Architecture with
            <span className="relative inline-block mx-2 group">
              <span className="absolute -inset-1 bg-green-500/20 rounded-full blur-sm group-hover:bg-green-500/30 transition-colors duration-300" />
              <span className="relative text-green-400 font-semibold">Live</span>
            </span>
            Data Update
          </p>
          
          {/* Live indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-sm text-gray-400">Real-time Updates</span>
          </div>
        </div>

        {/* Tech stack icons */}
        <div className="mt-8 flex justify-center gap-6">
          {[CloudIcon, ServerIcon, DatabaseIcon].map((Icon, index) => (
            <div 
              key={index}
              className="p-3 bg-slate-800/50 rounded-lg transform hover:scale-110 transition-all duration-300 hover:bg-slate-800/80 group"
            >
              <Icon className={`w-6 h-6 ${
                index === 0 ? 'text-blue-400' :
                index === 1 ? 'text-purple-400' :
                'text-green-400'
              } group-hover:animate-pulse`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add these custom keyframes to your existing styles
const customStyles = `
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }

  .animate-gradient-x {
    animation: gradient-x 15s ease infinite;
    background-size: 200% auto;
  }

  .delay-150 {
    animation-delay: 150ms;
  }
`;


const Counter = () => {
  const { data: counterData, error: counterError, isLoading: counterLoading } = useQuery({
    queryKey: ["counter"],
    queryFn: async () => {
      const response = await fetch(COUNTER_API);
      if (!response.ok) {
        throw new Error("Failed to fetch counter data");
      }
      return response.json() as Promise<CounterData>;
    },
    refetchInterval: 1000,
  });

  const { data: trendsData, error: trendsError, isLoading: trendsLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const response = await fetch(TRENDS_API);
      if (!response.ok) {
        throw new Error("Failed to fetch trends data");
      }
      return response.json() as Promise<TrendData[]>;
    },
  });

  if (counterError || trendsError) {
    toast.error("Failed to load counter data");
    return null;
  }

  const yesterdayVisits = trendsData ? trendsData[trendsData.length - 2]?.visits : 0;
  const todayVisits = counterData?.today_visits || 0;
  const isIncreasing = todayVisits >= yesterdayVisits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-[#243949] to-[#517fa4] rounded-2xl shadow-2xl animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      <div className="p-6 bg-black/20 backdrop-blur-sm rounded-xl transform hover:scale-105 transition-all duration-300 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-gray-200 text-lg font-medium">Total Visits</p>
          </div>
          <p className="text-4xl font-bold text-white text-center group-hover:scale-110 transform transition-transform duration-300">
            {counterLoading ? (
              <span className="inline-block animate-pulse">...</span>
            ) : (
              <span className="relative">
                {counterData?.total_visits.toLocaleString()}
                <span className="absolute -top-1 -right-4 text-sm text-blue-400">▲</span>
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="p-6 bg-black/20 backdrop-blur-sm rounded-xl transform hover:scale-105 transition-all duration-300 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DatabaseIcon className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-gray-200 text-lg font-medium">Today's Visits</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white group-hover:scale-110 transform transition-transform duration-300">
              {counterLoading || trendsLoading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                <span className="relative">
                  {counterData?.today_visits.toLocaleString()}
                  <span 
                    className={`absolute -top-1 -right-4 text-sm ${
                      isIncreasing ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isIncreasing ? '▲' : '▼'}
                  </span>
                </span>
              )}
            </p>
            {!counterLoading && !trendsLoading && (
              <p className="text-sm mt-2 text-gray-400">
                Yesterday's: {yesterdayVisits.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const VisitTrends = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const response = await fetch(TRENDS_API);
      if (!response.ok) {
        throw new Error("Failed to fetch trends data");
      }
      return response.json() as Promise<TrendData[]>;
    },
    refetchInterval: 500,
  });

  if (error) {
    toast.error("Failed to load trends data");
    return null;
  }

  const chartData = data?.map(item => ({
    day: parseInt(item.pageId.split('-')[2]),
    visits: item.visits,
    date: item.pageId
  })) || [];

  return (
    <div className="w-full p-6 bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] rounded-2xl shadow-2xl animate-fade-in relative group">
      <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CloudIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Visit Trends</h2>
          </div>
          {!isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Live Updates</span>
              </div>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '8px 12px',
                  }}
                  labelFormatter={(value) => `Day ${value}`}
                  formatter={(value: number) => [`${value.toLocaleString()} visits`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{
                    fill: '#60a5fa',
                    strokeWidth: 2,
                    r: 4,
                    strokeDasharray: ''
                  }}
                  activeDot={{
                    fill: '#60a5fa',
                    stroke: '#bfdbfe',
                    strokeWidth: 4,
                    r: 6
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const ArchitectureFlow = () => {
  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">Architecture Explained</h2>
      
      {/* Client Layer */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GlobeIcon className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-blue-400">Client Interface</h3>
        </div>
        <div className="flex justify-center">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/10 w-48 text-center">
            <p className="text-blue-400 font-medium">Web Browser</p>
            <p className="text-sm text-gray-400">User Interface</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <ArrowRightIcon className="w-6 h-6 text-blue-400 animate-pulse rotate-90" />
      </div>

      {/* DNS & CDN Layer */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CloudIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-400">DNS & Content Delivery</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-purple-500/10 text-center">
            <CloudIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-400 font-medium">Route 53</p>
            <p className="text-sm text-gray-400">DNS Routing</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-purple-500/10 text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-400 font-medium">CloudFront</p>
            <p className="text-sm text-gray-400">Global CDN</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <ArrowRightIcon className="w-6 h-6 text-blue-400 animate-pulse rotate-90" />
      </div>

      {/* Frontend Layer */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BoxIcon className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold text-green-400">Frontend Hosting</h3>
        </div>
        <div className="flex justify-center">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-green-500/10 text-center">
            <BoxIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-medium">S3 Bucket</p>
            <p className="text-sm text-gray-400 mb-2">Static Asset Storage</p>
            <div className="flex gap-2 justify-center">
              <span className="px-2 py-1 bg-yellow-500/10 rounded-md text-xs text-yellow-400">Vite</span>
              <span className="px-2 py-1 bg-blue-500/10 rounded-md text-xs text-blue-400">React</span>
              <span className="px-2 py-1 bg-teal-500/10 rounded-md text-xs text-teal-400">Tailwind</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <ArrowRightIcon className="w-6 h-6 text-blue-400 animate-pulse rotate-90" />
      </div>

      {/* Backend Layer */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ServerIcon className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-semibold text-orange-400">Serverless Backend</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-orange-500/10 text-center">
            <ServerIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-orange-400 font-medium">API Gateway</p>
            <p className="text-sm text-gray-400">REST API</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-orange-500/10 text-center">
            <RocketIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-orange-400 font-medium">Lambda</p>
            <p className="text-sm text-gray-400">Serverless Computing</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-orange-500/10 text-center sm:col-span-2 lg:col-span-1">
            <DatabaseIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-orange-400 font-medium">DynamoDB</p>
            <p className="text-sm text-gray-400">NoSQL Database</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <RefreshCcw className="w-6 h-6 text-blue-400 animate-pulse rotate-90" />
      </div>
      {/* CI/CD Pipeline - Side Note */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 mt-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <RocketIcon className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-semibold text-red-400">CI/CD Pipeline</h3>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 max-w-4xl">            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <RocketIcon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">GitHub Actions</p>
              <p className="text-sm text-gray-400">Build Process</p>
            </div>
            
            <div className="rotate-90 sm:rotate-0">
              <ArrowRightIcon className="w-6 h-6 text-red-400" />
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <Trash2Icon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Clear S3</p>
              <p className="text-sm text-gray-400">Remove Old Files</p>
            </div>
            
            <div className="rotate-90 sm:rotate-0">
              <ArrowRightIcon className="w-6 h-6 text-red-400" />
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <UploadCloudIcon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Fresh Deploy</p>
              <p className="text-sm text-gray-400">Upload New Build</p>
            </div>
            
            <div className="rotate-90 sm:rotate-0">
              <ArrowRightIcon className="w-6 h-6 text-red-400" />
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <RefreshCwIcon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Invalidate Cache</p>
              <p className="text-sm text-gray-400">Update CloudFront</p>
            </div>
          </div>
          
          {/* Pipeline Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10">
              <h4 className="text-red-400 font-medium mb-2">Build Phase</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Install dependencies</li>
                <li>• Run tests</li>
                <li>• Build production assets</li>
              </ul>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10">
              <h4 className="text-red-400 font-medium mb-2">Cleanup Phase</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Connect to S3 bucket</li>
                <li>• Delete existing files</li>
                <li>• Prepare for new deployment</li>
              </ul>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10">
              <h4 className="text-red-400 font-medium mb-2">Deploy Phase</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Upload new build files</li>
                <li>• Invalidate CDN cache</li>
                <li>• Verify deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update your Index component
const Index = () => {
  useEffect(() => {
    const incrementCounter = async () => {
      try {
        const response = await fetch(COUNTER_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to increment counter");
        }
      } catch (error) {
        console.error("Error incrementing counter:", error);
        toast.error("Failed to increment counter");
      }
    };

    incrementCounter();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1A1F2C] to-gray-900 px-4 py-8">
      <style>{customStyles}</style>
      <div className="max-w-6xl mx-auto space-y-8">
        <AnimatedTitle />
        <Counter />
        <VisitTrends />
        <ArchitectureFlow />
      </div>
    </div>
  );
};

export default Index;