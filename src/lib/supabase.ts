import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types.js';

// Retrieve keys from Vite environment variables safely
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Detect if we should run in mock mode
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Lazy-initialized real Supabase client
let realSupabaseClient: any = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (!realSupabaseClient) {
    realSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return realSupabaseClient;
}

// In mock mode, we use localStorage to persist mock users and sessions
const MOCK_PROFILES_KEY = 'lisantext_mock_profiles';
const MOCK_SESSION_KEY = 'lisantext_mock_session';

// Helper to seed or retrieve mock profiles
function getMockProfiles(): Record<string, UserProfile> {
  const stored = localStorage.getItem(MOCK_PROFILES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Clear corrupt data
    }
  }
  
  // Seed default admin and user
  const defaults: Record<string, UserProfile> = {
    'admin@example.com': {
      id: 'mock-admin-uuid',
      email: 'admin@example.com',
      role: 'admin'
    },
    'user@example.com': {
      id: 'mock-user-uuid',
      email: 'user@example.com',
      role: 'user'
    }
  };
  localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveMockProfiles(profiles: Record<string, UserProfile>) {
  localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(profiles));
}

// Auth API Wrapper
export const authService = {
  /**
   * Signs up a new user.
   */
  async signUp(email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<{ user: any; error: string | null }> {
    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Signup succeeded but no user was returned.');

        // Store role in database 'profiles' table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            role: role
          });

        if (profileError) {
          console.warn('Could not insert profile into DB. Attempting meta fallback...', profileError);
          // Fallback: try to store role in user_metadata by updating user
          await supabase.auth.updateUser({
            data: { role: role }
          });
        }

        return { user: data.user, error: null };
      } catch (err: any) {
        return { user: null, error: err.message || 'Error signing up.' };
      }
    } else {
      // Mock flow
      const profiles = getMockProfiles();
      const sanitizedEmail = email.toLowerCase().trim();
      
      if (profiles[sanitizedEmail]) {
        return { user: null, error: 'User already exists.' };
      }

      const mockId = 'mock-id-' + Math.random().toString(36).substring(2, 11);
      const newProfile: UserProfile = {
        id: mockId,
        email: sanitizedEmail,
        role
      };

      profiles[sanitizedEmail] = newProfile;
      saveMockProfiles(profiles);

      // Log in automatically in mock session
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(newProfile));

      return { user: { id: mockId, email: sanitizedEmail }, error: null };
    }
  },

  /**
   * Signs in an existing user.
   */
  async signIn(email: string, password: string): Promise<{ user: any; error: string | null }> {
    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        return { user: data.user, error: null };
      } catch (err: any) {
        return { user: null, error: err.message || 'Invalid credentials.' };
      }
    } else {
      // Mock flow
      const profiles = getMockProfiles();
      const sanitizedEmail = email.toLowerCase().trim();
      const profile = profiles[sanitizedEmail];

      if (!profile) {
        return { user: null, error: 'User not found. Use admin@example.com (admin) or user@example.com (user), or create a new account.' };
      }

      // Store current session
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(profile));
      return { user: { id: profile.id, email: profile.email }, error: null };
    }
  },

  /**
   * Signs out the current user.
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
  },

  /**
   * Retrieves current user session and profile.
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) return null;

        const user = session.user;

        // Fetch profile from database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          // Check user_metadata fallback
          const metadataRole = user.user_metadata?.role;
          if (metadataRole === 'admin' || metadataRole === 'user') {
            return {
              id: user.id,
              email: user.email || '',
              role: metadataRole
            };
          }
          
          // Default profile if nothing exists yet
          const defaultRole = 'user';
          // Save default profile to db
          await supabase.from('profiles').upsert({ id: user.id, email: user.email, role: defaultRole });
          return {
            id: user.id,
            email: user.email || '',
            role: defaultRole
          };
        }

        return {
          id: user.id,
          email: user.email || '',
          role: profile.role as 'admin' | 'user'
        };
      } catch (e) {
        console.error('Error fetching Supabase user profile:', e);
        return null;
      }
    } else {
      // Mock flow
      const session = localStorage.getItem(MOCK_SESSION_KEY);
      if (session) {
        try {
          return JSON.parse(session);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  /**
   * Allows updating a user's role (Admin functionality or simulation helper)
   */
  async updateUserRole(userId: string, email: string, role: 'user' | 'admin'): Promise<void> {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      await supabase.from('profiles').upsert({
        id: userId,
        email,
        role
      });
    } else {
      const profiles = getMockProfiles();
      const sanitizedEmail = email.toLowerCase().trim();
      if (profiles[sanitizedEmail]) {
        profiles[sanitizedEmail].role = role;
        saveMockProfiles(profiles);
        
        // Update current session if matching
        const currentSession = localStorage.getItem(MOCK_SESSION_KEY);
        if (currentSession) {
          const parsed = JSON.parse(currentSession);
          if (parsed.email === sanitizedEmail) {
            parsed.role = role;
            localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(parsed));
          }
        }
      }
    }
  }
};
