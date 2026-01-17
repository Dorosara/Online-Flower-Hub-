import { Product, User, Order } from '../types';
import { supabase } from './supabaseClient';

// --- Fallback Data ---
// Used when the database tables haven't been created yet.
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Red Roses',
    description: 'A timeless dozen of long-stemmed red roses, perfect for expressing love and passion.',
    price: 1499,
    category: 'Bouquets',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    featured: true
  },
  {
    id: '2',
    name: 'Spring Morning',
    description: 'A vibrant mix of tulips, daffodils, and daisies to brighten up any room.',
    price: 1299,
    category: 'Bouquets',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    featured: true
  },
  {
    id: '3',
    name: 'White Orchid',
    description: 'Elegant and sophisticated white orchid plant in a ceramic pot.',
    price: 2499,
    category: 'Plants',
    image: 'https://images.unsplash.com/photo-1566938064504-a38b584a2264?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    featured: false
  },
  {
    id: '4',
    name: 'Pink Peony Bunch',
    description: 'Lush and fragrant pink peonies, a seasonal favorite.',
    price: 1899,
    category: 'Bouquets',
    image: 'https://images.unsplash.com/photo-1563241527-3af69713220c?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    featured: true
  },
  {
    id: '5',
    name: 'Succulent Trio',
    description: 'Three low-maintenance succulents in a wooden trough.',
    price: 999,
    category: 'Plants',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    featured: false
  },
  {
    id: '6',
    name: 'Wedding Elegance',
    description: 'A premium bridal bouquet with white roses, lilies, and greenery.',
    price: 3999,
    category: 'Wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    featured: true
  }
];

// Helper to check if error is about missing table
const isTableMissing = (error: any) => {
  return error?.message?.includes('Could not find the table') || 
         error?.message?.includes('relation "public.products" does not exist') ||
         error?.message?.includes('relation "public.profiles" does not exist') ||
         error?.code === '42P01';
};

export const api = {
  products: {
    list: async (): Promise<Product[]> => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (error) {
          if (isTableMissing(error)) {
            console.warn('Using fallback products (DB table missing)');
            return FALLBACK_PRODUCTS;
          }
          throw error;
        }
        return data as Product[];
      } catch (e) {
        // Return fallback data on specific DB errors to prevent app crash
        if (isTableMissing(e)) return FALLBACK_PRODUCTS;
        console.error("Fetch products failed:", e);
        return FALLBACK_PRODUCTS;
      }
    },
    get: async (id: string): Promise<Product | undefined> => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (isTableMissing(error)) {
            return FALLBACK_PRODUCTS.find(p => p.id === id);
          }
          throw error;
        }
        return data as Product;
      } catch (e) {
         return FALLBACK_PRODUCTS.find(p => p.id === id);
      }
    },
    categories: async (): Promise<string[]> => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category');
        
        if (error) {
           if (isTableMissing(error)) {
             return Array.from(new Set(FALLBACK_PRODUCTS.map(p => p.category)));
           }
           throw error;
        }
        return Array.from(new Set(data?.map((p: any) => p.category) || []));
      } catch (e) {
        return Array.from(new Set(FALLBACK_PRODUCTS.map(p => p.category)));
      }
    }
  },
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user found");

      let profileName = email.split('@')[0];
      let profileRole: 'customer' | 'admin' = 'customer';

      // Try fetching profile, but don't fail login if table is missing
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (!profileError && profile) {
          profileName = profile.name;
          profileRole = profile.role;
        }
      } catch (e) {
        console.warn("Could not fetch profile (likely table missing), using defaults");
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        name: profileName,
        role: profileRole
      };
    },
    signup: async (name: string, email: string, password: string): Promise<User> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      return {
        id: data.user.id,
        email: data.user.email!,
        name: name,
        role: 'customer'
      };
    },
    logout: async () => {
      await supabase.auth.signOut();
    },
    getCurrentUser: async (): Promise<User | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      let profileName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      let profileRole: 'customer' | 'admin' = 'customer';

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          profileName = profile.name;
          profileRole = profile.role;
        }
      } catch (e) {
         // ignore
      }

      return {
        id: user.id,
        email: user.email!,
        name: profileName,
        role: profileRole
      };
    },
    updateProfile: async (userId: string, updates: { name: string; email: string }) => {
      try {
        // 1. Update the 'profiles' table
        const { error } = await supabase
          .from('profiles')
          .update({ name: updates.name, email: updates.email })
          .eq('id', userId);

        if (error) throw error;

        // 2. Optional: Sync name to Auth User Metadata so it persists in sessions nicely
        await supabase.auth.updateUser({
          data: { name: updates.name }
        });
        
        // Note: We are NOT calling auth.updateUser({ email }) here because that triggers 
        // a confirmation email flow which might disrupt the demo experience. 
        // We solely update the profile table reference as requested.
        
      } catch (e) {
        if (isTableMissing(e)) {
          console.warn("Simulating profile update (DB table missing)");
          return;
        }
        throw e;
      }
    }
  },
  orders: {
    create: async (userId: string, items: any[], total: number): Promise<Order> => {
      try {
        // 1. Create Order Record
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            total: total,
            status: 'pending'
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create Order Items
        const orderItems = items.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        return {
          id: orderData.id,
          userId: userId,
          items: items,
          total: total,
          status: 'pending',
          createdAt: orderData.created_at
        };
      } catch (e: any) {
        if (isTableMissing(e) || e?.message?.includes('relation "public.orders" does not exist')) {
          console.warn("Simulating order creation (DB tables missing)");
          // Simulate successful order for demo purposes
          return {
            id: `mock-${Date.now()}`,
            userId,
            items,
            total,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
        }
        throw e;
      }
    },
    list: async (userId: string): Promise<Order[]> => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              products (
                name,
                price,
                image
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          if (isTableMissing(error)) return []; // Return empty list if table missing
          throw error;
        }

        return data?.map((order: any) => ({
          id: order.id,
          userId: order.user_id,
          total: order.total,
          status: order.status,
          createdAt: order.created_at,
          items: order.order_items.map((oi: any) => ({
            name: oi.products?.name || 'Unknown Product',
            price: oi.products?.price || 0,
            image: oi.products?.image || '',
            quantity: oi.quantity,
            id: 'archived',
            description: '',
            category: '',
            stock: 0
          }))
        })) || [];
      } catch (e) {
        return [];
      }
    }
  }
};