import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, MessageCircle, Clock, Target, Activity } from 'lucide-react';

// Mock data - will be replaced with real MongoDB data
const leadsData = [
  { month: 'Jan', leads: 45, converted: 23 },
  { month: 'Feb', leads: 52, converted: 31 },
  { month: 'Mar', leads: 48, converted: 28 },
  { month: 'Apr', leads: 61, converted: 35 },
  { month: 'May', leads: 55, converted: 42 },
  { month: 'Jun', leads: 67, converted: 48 },
];

const responseTimeData = [
  { day: 'Mon', avgTime: 2.5 },
  { day: 'Tue', avgTime: 1.8 },
  { day: 'Wed', avgTime: 3.2 },
  { day: 'Thu', avgTime: 2.1 },
  { day: 'Fri', avgTime: 2.8 },
  { day: 'Sat', avgTime: 4.1 },
  { day: 'Sun', avgTime: 3.5 },
];

const chatStatusData = [
  { name: 'Active', value: 45, color: '#10B981' },
  { name: 'Pending', value: 23, color: '#F59E0B' },
  { name: 'Resolved', value: 67, color: '#E70F42' },
  { name: 'Archived', value: 12, color: '#6B7280' },
];

const stats = [
  {
    title: 'Total Leads',
    value: '1,247',
    change: '+12.5%',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    title: 'Active Chats', 
    value: '45',
    change: '+8.1%',
    icon: MessageCircle,
    color: 'text-success',
    bgColor: 'bg-success/10'
  },
  {
    title: 'Avg Response Time',
    value: '2.4h',
    change: '-15.3%',
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  {
    title: 'Conversion Rate',
    value: '68.5%',
    change: '+5.2%',
    icon: Target,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your lead management performance</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="card-elegant hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-success' : 'text-primary'
                      }`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Leads Overview
              </CardTitle>
              <CardDescription>
                Monthly leads generation and conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between px-4 pb-4 space-x-2">
                {leadsData.map((data, index) => {
                  const maxValue = Math.max(...leadsData.map(d => Math.max(d.leads, d.converted)));
                  const leadsHeight = (data.leads / maxValue) * 240;
                  const convertedHeight = (data.converted / maxValue) * 240;
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                      <div className="flex items-end space-x-1 h-60">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: leadsHeight }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="w-6 bg-secondary rounded-t-md"
                          title={`Leads: ${data.leads}`}
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: convertedHeight }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                          className="w-6 bg-primary rounded-t-md"
                          title={`Converted: ${data.converted}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center space-x-6 mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-secondary rounded"></div>
                  <span className="text-sm text-muted-foreground">Total Leads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-sm text-muted-foreground">Converted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Response Time Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-success" />
                Response Time Trends
              </CardTitle>
              <CardDescription>
                Average response time across the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] relative">
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                  {responseTimeData.map((data, index) => {
                    const maxTime = Math.max(...responseTimeData.map(d => d.avgTime));
                    const height = (data.avgTime / maxTime) * 240;
                    
                    return (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: height }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="w-2 bg-primary rounded-full relative"
                        />
                        <span className="text-xs text-muted-foreground font-medium">
                          {data.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="border-t border-muted-foreground/20" />
                  ))}
                </div>
              </div>
              <div className="text-center pt-4 border-t">
                <span className="text-sm text-muted-foreground">Average Response Time (hours)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chat Status & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-warning" />
                Chat Status
              </CardTitle>
              <CardDescription>
                Distribution of chat statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[250px] relative">
                <div className="relative w-40 h-40">
                  {chatStatusData.map((item, index) => {
                    const total = chatStatusData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = (item.value / total) * 100;
                    const cumulativePercentage = chatStatusData
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.value / total) * 100, 0);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ strokeDasharray: '0 100' }}
                        animate={{ strokeDasharray: `${percentage} 100` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="absolute inset-0"
                        style={{
                          transform: `rotate(${cumulativePercentage * 3.6}deg)`,
                        }}
                      >
                        <svg className="w-full h-full" viewBox="0 0 42 42">
                          <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="3"
                            strokeDasharray={`${percentage} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {chatStatusData.reduce((sum, d) => sum + d.value, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chatStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-semibold text-foreground ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest lead interactions and system updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    action: 'New lead registered',
                    details: 'Alice Johnson from TechCorp submitted contact form',
                    time: '2 minutes ago',
                    type: 'lead'
                  },
                  {
                    action: 'Chat conversation ended',
                    details: 'Bob Smith conversation marked as resolved',
                    time: '15 minutes ago',
                    type: 'chat'
                  },
                  {
                    action: 'Lead sent to Odoo',
                    details: 'Carol Williams lead exported to Odoo CRM',
                    time: '1 hour ago',
                    type: 'export'
                  },
                  {
                    action: 'Response time improved',
                    details: 'Average response time decreased by 20%',
                    time: '2 hours ago',
                    type: 'metric'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'lead' ? 'bg-primary' :
                      activity.type === 'chat' ? 'bg-success' :
                      activity.type === 'export' ? 'bg-warning' :
                      'bg-secondary'
                    }`} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}