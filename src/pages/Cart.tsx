import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

const Cart = () => {
  const { items, removeItem, updateQuantity, totalItems, totalAmount } = useCart()
  const { user } = useAuth()

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild>
          <Link to="/menu">Browse Menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-card p-4 rounded-lg"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-muted-foreground">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right min-w-[100px]">
              <div className="font-semibold">₹{item.price * item.quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({totalItems} items)</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Fee</span>
            <span>₹50</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>₹{totalAmount + 50}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Button asChild className="w-full">
            <Link to={user ? '/checkout' : '/login'}>
              Proceed to Checkout
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/menu">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Cart 