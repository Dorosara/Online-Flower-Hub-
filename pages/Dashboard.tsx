import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Dashboard = () => {
  const { user, orders, refreshOrders } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      refreshOrders();
    }
  }, [user, navigate, refreshOrders]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 drop-shadow-sm">My Account</h1>
        <p className="text-gray-600 mt-2 font-medium">Welcome back, {user.name}!</p>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-pink-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-white/50">
          <h2 className="text-lg font-medium text-gray-900">Order History</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-white/40 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between mb-4">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="mr-4">
                      <span className="block text-xs text-gray-500 uppercase">Order ID</span>
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 uppercase">Date</span>
                      <span className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                   <h4 className="text-sm font-medium text-gray-700 mb-2">Items</h4>
                   <ul className="space-y-2">
                     {order.items.map((item, idx) => (
                       <li key={idx} className="flex items-center text-sm text-gray-600">
                         <span className="w-8 text-gray-400">{item.quantity}x</span>
                         <span>{item.name}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};