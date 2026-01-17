import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/UIComponents';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-lg border border-pink-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/90" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/90" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>Sign in</Button>
          </div>
          <div className="text-center">
            <Link to="/signup" className="text-sm text-primary-600 hover:text-primary-500">Don't have an account? Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-lg border border-pink-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join FlowerHub today</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/90" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/90" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/90" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>Sign Up</Button>
          </div>
          <div className="text-center">
            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">Already have an account? Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};