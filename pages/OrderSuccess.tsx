import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '../components/UIComponents';

export const OrderSuccess = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-white/85 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-pink-100 max-w-lg w-full">
        <div className="rounded-full bg-green-100 p-6 mb-6 inline-block">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and are getting your blooms ready.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 hover:bg-white">
              View Order Status
            </Button>
          </Link>
          <Link to="/shop">
            <Button size="lg" className="w-full sm:w-auto shadow-md">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};