import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Flower2, User as UserIcon, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// --- Navbar ---
export const Navbar = () => {
  const { cartCount, user, logout } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-primary-600" />
            <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">FlowerHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Shop</Link>
            
            <div className="flex items-center space-x-4 ml-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                    <UserIcon className="h-5 w-5" />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Log In</Link>
              )}
              
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-4 relative p-2 text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <div className="px-4 pt-2 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-700">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-700">Shop</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-700">My Profile</Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-700">My Orders</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left py-2 text-base font-medium text-gray-700">Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-700">Log In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer ---
export const Footer = () => (
  <footer className="bg-gray-900 text-white pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <Flower2 className="h-6 w-6 text-primary-400" />
            <span className="font-serif text-xl font-bold">FlowerHub</span>
          </div>
          <p className="text-gray-400 text-sm">Delivering happiness, one petal at a time. Premium blooms for every occasion.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/shop" className="hover:text-primary-400 transition">All Products</Link></li>
            <li><Link to="/shop?cat=Bouquets" className="hover:text-primary-400 transition">Bouquets</Link></li>
            <li><Link to="/shop?cat=Plants" className="hover:text-primary-400 transition">Plants</Link></li>
            <li><Link to="/shop?cat=Wedding" className="hover:text-primary-400 transition">Wedding</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-primary-400 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-primary-400 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-primary-400 transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-primary-400 transition">Returns</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">Subscribe for latest updates and offers.</p>
          <div className="flex">
            <input type="email" placeholder="Your email" className="px-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-primary-500 text-sm" />
            <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-md text-sm font-medium transition">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} FlowerHub. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-primary-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};