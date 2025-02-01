import * as React from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BoxIcon } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useToast } from "@/components/ui/use-toast";

import { 
  RocketIcon,
  BarChart2Icon,
  UploadCloudIcon,
  RefreshCwIcon,
  Trash2Icon,
  TrendingUpIcon, 
  DatabaseIcon, 
  CloudIcon,
  GlobeIcon,
  ServerIcon,
  Zap,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCcw,
  InfoIcon,
  ArrowRightIcon
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const StatCard = ({ icon: Icon, title, value, description, trend, defaultColor, isLoading }) => {
  // Determine color based on trend for traffic cards
  const isTrafficCard = title.includes('Traffic') || title.includes('Visits');
  const color = isTrafficCard 
    ? (trend >= 0 ? 'emerald' : 'red')
    : defaultColor;
    
  const trendValue = trend > 0 ? `+${trend}%` : `${trend}%`;
  const TrendIcon = trend > 0 ? ArrowUpIcon : ArrowDownIcon;

  // Define color classes for different elements
  const colorClasses = {
    emerald: {
      icon: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      trend: "text-emerald-400",
      progress: "bg-emerald-500/50",
      gradient: "from-emerald-500/10"
    },
    red: {
      icon: "text-red-400",
      iconBg: "bg-red-500/10",
      trend: "text-red-400",
      progress: "bg-red-500/50",
      gradient: "from-red-500/10"
    },
    blue: {
      icon: "text-blue-400",
      iconBg: "bg-blue-500/10",
      trend: "text-blue-400",
      progress: "bg-blue-500/50",
      gradient: "from-blue-500/10"
    }
  };
  
  return (
    <Card className="relative overflow-hidden group border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].gradient} via-transparent to-transparent transition-opacity opacity-50 group-hover:opacity-100`} />
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[color].iconBg}`}>
              <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
            </div>
            <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-300">
                <InfoIcon className="w-4 h-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 border-slate-800 bg-slate-900">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-200">{title} Explained</h4>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="h-8 bg-slate-800/50 animate-pulse rounded-md" />
              <div className="h-4 w-24 bg-slate-800/50 animate-pulse rounded-md" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-200">{value.toLocaleString()}</span>
                <div className={`flex items-center gap-1 text-sm ${colorClasses[color].trend}`}>
                  <TrendIcon className="w-4 h-4" />
                  {trendValue}
                </div>
              </div>
              <div className="w-full bg-slate-800/50 h-2 rounded-full">
                <div
                  className={`h-full rounded-full transition-all ${colorClasses[color].progress}`}
                  style={{ width: `${Math.min(Math.abs(trend), 100)}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};


const AnalyticsDashboard = () => {
  const { data: counterData, isLoading: counterLoading } = useQuery({
    queryKey: ["counter"],
    queryFn: async () => {
      const response = await fetch(COUNTER_API);
      if (!response.ok) throw new Error("Failed to fetch counter data");
      return response.json();
    },
    refetchInterval: 1000,
  });

  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const response = await fetch(TRENDS_API);
      if (!response.ok) throw new Error("Failed to fetch trends data");
      return response.json();
    },
    refetchInterval: 500,
  });

  const yesterdayVisits = trendsData ? trendsData[trendsData.length - 2]?.visits : 0;
  const todayVisits = counterData?.today_visits || 0;
  const visitTrend = yesterdayVisits ? ((todayVisits - yesterdayVisits) / yesterdayVisits * 100).toFixed(1) : 0;

  const chartData = trendsData?.map(item => ({
    day: new Date(item.pageId).toLocaleDateString('en-US', { weekday: 'short' }),
    visits: item.visits,
    date: item.pageId
  })) || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={TrendingUpIcon}
          title="Total Visits"
          value={counterData?.total_visits || 0}
          description="Cumulative number of visitors since launch"
          trend={15.7}
          defaultColor="blue"
          isLoading={counterLoading}
        />
        <StatCard
          icon={DatabaseIcon}
          title="Today's Traffic"
          value={todayVisits}
          description="Number of visitors in the last 24 hours"
          trend={Number(visitTrend)}
          defaultColor="emerald"
          isLoading={counterLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                Analytics Overview
                <Badge variant="secondary" className="ml-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </div>
                </Badge>
              </CardTitle>
              <CardDescription>Detailed view of visitor patterns</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area" className="space-y-4">
            <TabsList>
              <TabsTrigger value="area" className="flex items-center gap-2">
                <BarChart2Icon className="w-4 h-4" />
                Area View
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                Line View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="area" className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{label}</p>
                            <p className="text-primary font-bold">
                              {payload[0].value.toLocaleString()} visits
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#visitGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="line" className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{label}</p>
                            <p className="text-primary font-bold">
                              {payload[0].value.toLocaleString()} visits
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ strokeWidth: 4, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};


const Counter = () => {
  const { data: counterData, error: counterError, isLoading: counterLoading } = useQuery({
    queryKey: ["counter"],
    queryFn: async () => {
      const response = await fetch(COUNTER_API);
      if (!response.ok) throw new Error("Failed to fetch counter data");
      return response.json();
    },
    refetchInterval: 1000,
  });

  const { data: trendsData, error: trendsError, isLoading: trendsLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const response = await fetch(TRENDS_API);
      if (!response.ok) throw new Error("Failed to fetch trends data");
      return response.json();
    },
  });

  const yesterdayVisits = trendsData ? trendsData[trendsData.length - 2]?.visits : 0;
  const todayVisits = counterData?.today_visits || 0;
  const isIncreasing = todayVisits >= yesterdayVisits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-blue-400" />
            </div>
            <CardTitle>Total Visits</CardTitle>
          </div>
          <CardDescription>Cumulative visits since launch</CardDescription>
        </CardHeader>
        <CardContent>
          {counterLoading ? (
            <div className="h-12 bg-slate-700/30 animate-pulse rounded-md" />
          ) : (
            <motion.p 
              className="text-4xl font-bold"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {counterData?.total_visits.toLocaleString()}
            </motion.p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DatabaseIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <CardTitle>Today's Visits</CardTitle>
          </div>
          <CardDescription>Visits in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          {counterLoading ? (
            <div className="h-12 bg-slate-700/30 animate-pulse rounded-md" />
          ) : (
            <motion.div 
              className="space-y-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <p className="text-4xl font-bold flex items-center gap-2">
                {todayVisits.toLocaleString()}
                <span className={`text-sm ${isIncreasing ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isIncreasing ? '▲' : '▼'}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Yesterday: {yesterdayVisits.toLocaleString()}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const VisitTrends = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trends"],
    queryFn: async () => {
      const response = await fetch(TRENDS_API);
      if (!response.ok) throw new Error("Failed to fetch trends data");
      return response.json();
    },
    refetchInterval: 500,
  });

  const chartData = data?.map(item => ({
    day: parseInt(item.pageId.split('-')[2]),
    visits: item.visits,
    date: item.pageId
  })) || [];

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CloudIcon className="w-6 h-6 text-blue-400" />
            </div>
            <CardTitle>Visit Trends</CardTitle>
          </div>
          {!isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                Live Updates
              </span>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
        <CardDescription>Daily visitor statistics over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] bg-slate-700/30 animate-pulse rounded-md" />
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="border bg-background p-3 rounded-lg shadow-xl">
                          <p className="font-medium">Day {label}</p>
                          <p className="text-blue-400 font-bold">
                            {payload[0].value.toLocaleString()} visits
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    strokeWidth: 2,
                    r: 4,
                    strokeDasharray: ''
                  }}
                  activeDot={{
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 4,
                    r: 6
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
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

const Index: React.FC = () => {
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to increment counter"
        });
      }
    };

    incrementCounter();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1A1F2C] to-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <AnimatedTitle />
        <AnalyticsDashboard /> {/* Replace Counter and VisitTrends with this */}
        <ArchitectureFlow />
      </div>
    </div>
  );
};


export default Index;