import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminApi } from '@/services/api';

interface AnalyticsData {
  revenue: {
    daily: { date: string; amount: number }[];
    monthly: { month: string; amount: number }[];
  };
  orders: {
    total: number;
    statusDistribution: { status: string; count: number }[];
    categoryDistribution: { category: string; count: number }[];
  };
  users: {
    total: number;
    newUsers: { date: string; count: number }[];
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getAnalytics(timeframe);
      setAnalyticsData(response.data);
    } catch (error: any) {
      console.error('Analytics error:', error.response || error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch analytics data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [timeframe, user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg font-semibold text-gray-800">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-lg font-semibold text-red-600">{error}</div>
        <Button onClick={fetchAnalytics}>Retry</Button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg font-semibold text-gray-800">No data available</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <div className="space-x-4">
          <Button
            variant={timeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeframe('week')}
            className="font-semibold"
          >
            Week
          </Button>
          <Button
            variant={timeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeframe('month')}
            className="font-semibold"
          >
            Month
          </Button>
          <Button
            variant={timeframe === 'year' ? 'default' : 'outline'}
            onClick={() => setTimeframe('year')}
            className="font-semibold"
          >
            Year
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.orders.total}</p>
        </Card>
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{analyticsData.users.total}</p>
        </Card>
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.bookings.total}</p>
        </Card>
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pending Bookings</h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analyticsData.bookings.pending}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.revenue.daily}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#F3F4F6',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.orders.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.orders.statusDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#F3F4F6',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {analyticsData.orders.statusDistribution.map((item, index) => (
              <div key={item.status} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {item.status}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Categories</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.orders.categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#F3F4F6',
                  }}
                />
                <Bar dataKey="count" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* New Users */}
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">New Users</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.users.newUsers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#F3F4F6',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#34D399"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 