import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/UIComponents';

export const Checkout = () => {
  const { cart, cartTotal, placeOrder, user } = useStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', zip: '', cardName: '', cardNumber: '', expiry: '', cvv: ''
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  // Redirect to login if not authenticated (simplified protection)
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="mb-6 text-gray-600">You need to be logged in to complete your purchase.</p>
        <Button onClick={() => navigate('/login?redirect=checkout')}>Go to Login</Button>
      </div>
    );
  }

  const shippingCost = cartTotal > 100 ? 0 : 15;
  const total = cartTotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await placeOrder();
      // Simulate processing
      setTimeout(() => {
        setLoading(false);
        addToast('Order placed successfully!', 'success');
        navigate('/order-success'); 
      }, 1500);
    } catch (error) {
      console.error(error);
      setLoading(false);
      addToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Forms */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First name</label>
                <input required name="firstName" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last name</label>
                <input required name="lastName" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input required name="address" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input required name="city" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                <input required name="zip" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name on card</label>
                <input required name="cardName" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Card number</label>
                <input required name="cardNumber" type="text" maxLength={19} placeholder="0000 0000 0000 0000" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                <input required name="expiry" placeholder="MM/YY" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVC</label>
                <input required name="cvv" type="text" maxLength={3} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 px-3 py-2 border" />
              </div>
            </div>
          </div>
        </form>

        {/* Order Review */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
            <ul className="divide-y divide-gray-200 mb-6">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex">
                  <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col justify-between">
                    <div>
                       <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                       </div>
                       <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="space-y-4 border-t border-gray-200 pt-6">
               <div className="flex justify-between text-sm text-gray-600">
                 <p>Subtotal</p>
                 <p>₹{cartTotal.toFixed(2)}</p>
               </div>
               <div className="flex justify-between text-sm text-gray-600">
                 <p>Shipping</p>
                 <p>₹{shippingCost.toFixed(2)}</p>
               </div>
               <div className="flex justify-between text-base font-medium text-gray-900 border-t border-gray-200 pt-4">
                 <p>Total</p>
                 <p>₹{total.toFixed(2)}</p>
               </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              className="w-full mt-8" 
              size="lg" 
              isLoading={loading}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};