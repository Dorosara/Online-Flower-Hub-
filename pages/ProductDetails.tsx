import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, Truck } from 'lucide-react';
import { api } from '../services/mockData';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/UIComponents';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.products.get(id).then(p => {
        setProduct(p || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
    <Link to="/shop" className="text-primary-600 hover:underline">Back to Shop</Link>
  </div>;

  const handleAddToCart = () => {
    addToCart(product, qty);
    addToast(`Added ${qty} ${product.name} to cart`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-w-4 aspect-h-3 shadow-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary-600 mb-6">₹{product.price.toFixed(2)}</p>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
             <div className="flex items-center text-sm text-gray-600">
               <Check className="h-4 w-4 text-green-500 mr-2" /> In Stock: {product.stock > 0 ? 'Ready to ship' : 'Out of stock'}
             </div>
             <div className="flex items-center text-sm text-gray-600">
               <Truck className="h-4 w-4 text-gray-400 mr-2" /> Free delivery on orders over ₹100
             </div>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 hover:bg-gray-50 text-gray-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-medium text-gray-900">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="p-2 hover:bg-gray-50 text-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleAddToCart} size="lg" className="flex-1">
                  Add to Cart
                </Button>
                <Button onClick={() => { handleAddToCart(); navigate('/cart'); }} variant="secondary" size="lg" className="flex-1">
                  Buy Now
                </Button>
              </div>
            </div>
          ) : (
             <div className="bg-gray-100 p-4 rounded text-center text-gray-600 font-medium">
               This item is currently out of stock.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};