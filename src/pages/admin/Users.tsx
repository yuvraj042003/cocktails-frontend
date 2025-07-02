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
import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { adminApi } from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const { toast } = useToast();

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      const response = await adminApi.getUsers({ page, limit: 10, search });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      fetchUsers(pagination.page, searchQuery);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      fetchUsers(pagination.page, searchQuery);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Name</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Email</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Role</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-600 dark:text-gray-300">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-600 dark:text-gray-300">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} className="border-gray-200 dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{user.name}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                  <TableCell className="capitalize text-gray-700 dark:text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
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
                          onClick={() =>
                            handleUpdateRole(
                              user._id,
                              user.role === 'user' ? 'admin' : 'user'
                            )
                          }
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {user.role === 'user'
                            ? 'Make Admin'
                            : 'Remove Admin Rights'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete User
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
                onClick={() => fetchUsers(page, searchQuery)}
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

export default Users; 