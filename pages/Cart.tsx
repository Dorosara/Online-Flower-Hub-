import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/UIComponents';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any flowers yet.</p>
        <Link to="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:justify-between w-full">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end sm:justify-between">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-50 text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-50 text-gray-600"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={clearCart} className="text-sm text-gray-500 hover:text-gray-700 underline">Clear Cart</button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-gray-50 rounded-lg p-6 h-fit border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-sm font-medium text-gray-900">₹{cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="text-sm font-medium text-gray-900">{cartTotal > 100 ? 'Free' : '₹15.00'}</p>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-xl font-bold text-gray-900">₹{(cartTotal + (cartTotal > 100 ? 0 : 15)).toFixed(2)}</p>
            </div>
          </div>
          <Button onClick={() => navigate('/checkout')} className="w-full mt-6" size="lg">
            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="mt-4 text-center">
            <Link to="/shop" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
              or Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};