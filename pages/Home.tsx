import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { api } from '../services/mockData';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useStore();
  const { addToast } = useToast();

  useEffect(() => {
    api.products.list().then(products => {
      setFeaturedProducts(products.filter(p => p.featured).slice(0, 4));
    });
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product);
    addToast(`Added ${product.name} to cart`, 'success');
  };

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <div className="relative bg-gray-900/90 overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1595155106950-c7826a798b0f?auto=format&fit=crop&q=80&w=2000" 
            alt="Flower Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-md">
            Say It With Flowers
          </h1>
          <p className="mt-4 text-xl text-gray-100 max-w-2xl mx-auto mb-10 drop-shadow">
            Hand-picked, artistically arranged, and delivered fresh to your door. The perfect gift for any occasion or just because.
          </p>
          <div className="flex space-x-4">
            <Link 
              to="/shop" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 md:text-lg transition-colors shadow-lg"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Features - Semi-transparent background */}
      <div className="py-12 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white/80 rounded-xl shadow-sm border border-pink-100">
              <Truck className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery available for orders placed before 2 PM.</p>
            </div>
            <div className="p-6 bg-white/80 rounded-xl shadow-sm border border-pink-100">
              <ShieldCheck className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Freshness Guaranteed</h3>
              <p className="text-gray-600">We promise your flowers will stay fresh for at least 7 days.</p>
            </div>
            <div className="p-6 bg-white/80 rounded-xl shadow-sm border border-pink-100">
              <Clock className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer care team is always here to help you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Blooms</h2>
          <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-medium flex items-center group">
            View All <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="group relative bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 h-64 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock === 0 && (
                   <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                     Sold Out
                   </div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`/product/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="flex-1 flex items-end justify-between mt-4">
                  <p className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock === 0}
                    className="relative z-10 text-sm font-medium text-primary-600 hover:text-primary-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};