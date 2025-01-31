import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

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
    <div className="text-center p-4 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Visit Counter</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-gray-400 mb-2">Total Visits</p>
          <p className="text-3xl font-bold text-blue-400">
            {isLoading ? "..." : data?.total_visits}
          </p>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-gray-400 mb-2">Today's Visits</p>
          <p className="text-3xl font-bold text-green-400">
            {isLoading ? "..." : data?.today_visits}
          </p>
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
    // Add refetchInterval to automatically update trends data
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
    <div className="w-full p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Visit Trends</h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
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
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">AWS Infrastructure Demo</h1>
          <p className="text-gray-300 text-lg">
            This Vite, React, Tailwind SPA is routed with Route53 custom domain, exposed through CloudFront, and hosted on S3 bucket.
          </p>
          <p className="text-gray-300 text-lg">
            The backend utilizes AWS serverless archi with Lambda and DynamoDB and connected to the frontend with API Gateway.
          </p>
        </div>

        <Counter />
        <VisitTrends />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <a
            href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-center transition-colors"
          >
            Read Amazon S3 Documentation
          </a>
          <a
            href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors"
          >
            Read Amazon CloudFront Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export { Index };