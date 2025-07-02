import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Search } from 'lucide-react';
import { adminApi } from '@/services/api';

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const { toast } = useToast();

  const fetchOrders = async (page = 1, search = '', status = '') => {
    try {
      setIsLoading(true);
      const response = await adminApi.getOrders({
        page,
        limit: 10,
        search,
        status,
      });
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(1, searchQuery, statusFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
      fetchOrders(pagination.page, searchQuery, statusFilter);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="p-8 space-y-6 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Orders Management</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <select
          className="border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Order ID</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Customer</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Items</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Total</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-600 dark:text-gray-300">
                  Loading...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-600 dark:text-gray-300">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} className="border-gray-200 dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{order._id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{order.userId.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {order.userId.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${
                          order.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                            : order.status === 'processing'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                        }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(order._id, 'processing')}
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(order._id, 'completed')}
                          className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50"
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={page === pagination.page ? 'default' : 'outline'}
                size="sm"
                onClick={() => fetchOrders(page, searchQuery, statusFilter)}
              >
                {page}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Orders; 