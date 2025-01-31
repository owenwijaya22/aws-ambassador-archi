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

const Counter = () => {
  const { data, error, isLoading } = useQuery({
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

  if (error) {
    toast.error("Failed to load counter data");
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-[#243949] to-[#517fa4] rounded-2xl shadow-2xl animate-fade-in">
      <div className="p-6 bg-black/20 backdrop-blur-sm rounded-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center gap-3 mb-3">
          <TrendingUpIcon className="w-6 h-6 text-blue-400" />
          <p className="text-gray-200 text-lg font-medium">Total Visits</p>
        </div>
        <p className="text-4xl font-bold text-white">
          {isLoading ? "..." : data?.total_visits.toLocaleString()}
        </p>
      </div>
      <div className="p-6 bg-black/20 backdrop-blur-sm rounded-xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center gap-3 mb-3">
          <DatabaseIcon className="w-6 h-6 text-green-400" />
          <p className="text-gray-200 text-lg font-medium">Today's Visits</p>
        </div>
        <p className="text-4xl font-bold text-white">
          {isLoading ? "..." : data?.today_visits.toLocaleString()}
        </p>
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
    refetchInterval: 1000,
  });

  if (error) {
    toast.error("Failed to load trends data");
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-white">Loading trends...</p>
      </div>
    );
  }

  const chartData = data?.map(item => ({
    day: parseInt(item.pageId.split('-')[2]),
    visits: item.visits
  })) || [];

  return (
    <div className="w-full p-6 bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] rounded-2xl shadow-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-white text-center flex items-center justify-center gap-3">
        <CloudIcon className="w-6 h-6 text-blue-400" />
        Visit Trends
      </h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="day" 
              stroke="#fff"
              label={{ value: 'Day of Month', position: 'bottom', fill: '#fff' }}
            />
            <YAxis 
              stroke="#fff"
              label={{ value: 'Number of Visits', angle: -90, position: 'insideLeft', fill: '#fff' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Line 
              type="monotone" 
              dataKey="visits" 
              stroke="#60a5fa" 
              strokeWidth={3}
              dot={{ fill: '#60a5fa', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const ArchitectureFlow = () => {
  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">System Architecture & Data Flow</h2>
      
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
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
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
          <div className="bg-slate-900/50 p-4 rounded-xl border border-orange-500/10 text-center">
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
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl">            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <RocketIcon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">GitHub Actions</p>
              <p className="text-sm text-gray-400">Build Process</p>
            </div>
            
            <ArrowRightIcon className="w-6 h-6 text-red-400" />
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <Trash2Icon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Clear S3</p>
              <p className="text-sm text-gray-400">Remove Old Files</p>
            </div>
            
            <ArrowRightIcon className="w-6 h-6 text-red-400" />
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                <UploadCloudIcon className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">Fresh Deploy</p>
              <p className="text-sm text-gray-400">Upload New Build</p>
            </div>
            
            <ArrowRightIcon className="w-6 h-6 text-red-400" />
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/10 text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1A1F2C] to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <RocketIcon className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              AWS Infrastructure Demo
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl">
            Modern Cloud Architecture with Real-time Analytics
          </p>
        </div>

        {/* Analytics Components */}
        <Counter />
        <VisitTrends />
        
        {/* Architecture Flow */}
        <ArchitectureFlow />
      </div>
    </div>
  );
};

export default Index;