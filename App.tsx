import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar, Footer } from './components/UIComponents';
import { FlowerBackground } from './components/FlowerBackground';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login, Signup } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { OrderSuccess } from './pages/OrderSuccess';
import { Profile } from './pages/Profile';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Make children optional to avoid TS error: Property 'children' is missing in type '{}'
const Layout = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen relative">
    <FlowerBackground />
    <Navbar />
    {/* Removed bg-white/50 overlay to allow flowers to be vibrant. Page components manage their own transparency. */}
    <main className="flex-grow z-0">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;