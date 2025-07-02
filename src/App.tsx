import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { StripeProvider } from '@/contexts/StripeContext'
import { CartProvider } from '@/contexts/CartContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Layouts
import RootLayout from '@/layouts/RootLayout'

// Pages
import Home from '@/pages/Home'
import Menu from '@/pages/Menu'
import Cart from '@/pages/Cart'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import BookTable from '@/components/BookTable'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import Checkout from '@/pages/Checkout'
import PaymentSuccess from '@/pages/PaymentSuccess'
import MyBookings from '@/pages/MyBookings'
import AdminDashboard from '@/pages/AdminDashboard'
import Users from '@/pages/admin/Users'
import Orders from '@/pages/admin/Orders'
import Analytics from '@/pages/admin/Analytics'
import AdminBookings from '@/pages/admin/Bookings'
import ProductDetails from '@/pages/ProductDetails'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <CartProvider>
              <StripeProvider>
                <Routes>
                  <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route
                      path="profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="payment-success"
                      element={
                        <ProtectedRoute>
                          <PaymentSuccess />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="book"
                      element={
                        <ProtectedRoute>
                          <BookTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="my-bookings"
                      element={
                        <ProtectedRoute>
                          <MyBookings />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Admin Routes */}
                    <Route
                      path="admin"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Analytics />} />
                      <Route path="users" element={<Users />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="bookings" element={<AdminBookings />} />
                      <Route path="analytics" element={<Analytics />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                <Toaster />
              </StripeProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
