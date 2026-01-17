import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/mockData';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

export const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useStore();
  const { addToast } = useToast();

  const activeCategory = searchParams.get('cat') || 'All';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [allProducts, allCategories] = await Promise.all([
        api.products.list(),
        api.products.categories()
      ]);
      setProducts(allProducts);
      setCategories(['All', ...allCategories]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (cat: string) => {
    setSearchParams(prev => {
      if (cat === 'All') {
        prev.delete('cat');
      } else {
        prev.set('cat', cat);
      }
      return prev;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchParams(prev => {
      if (q) prev.set('q', q);
      else prev.delete('q');
      return prev;
    });
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    addToast(`Added ${product.name} to cart`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 drop-shadow-sm">Shop Collection</h1>
          <p className="text-gray-600 mt-1 font-medium">Found {filteredProducts.length} items</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search flowers..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg border border-pink-100 shadow-sm sticky top-24">
            <div className="flex items-center space-x-2 mb-4">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeCategory === cat 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-80 bg-white/50 rounded-lg"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group bg-white/80 backdrop-blur-sm border border-pink-100 rounded-lg shadow-sm hover:shadow-lg hover:bg-white/95 transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative aspect-w-1 aspect-h-1 h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                        Sold Out
                      </div>
                    )}
                    {product.stock > 0 && (
                      <button 
                         onClick={() => handleAddToCart(product)}
                         className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg text-primary-600 hover:text-primary-700 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                         title="Add to Cart"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                         </svg>
                      </button>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-lg border border-pink-100">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter.</p>
              <button onClick={() => { setSearchParams({}); }} className="mt-4 text-primary-600 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};