// MongoDB client configuration
// Note: This is a client-side abstraction - actual MongoDB operations should go through your backend API

const MONGODB_API_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:3000/api';

class MongoDBClient {
  private apiUrl: string;
  private authToken: string | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    // Load auth token from localStorage
    const storedAuth = localStorage.getItem('mongodb_auth');
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      this.authToken = auth.token;
    }
  }

  // Authentication methods
  auth = {
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      this.authToken = data.token;
      localStorage.setItem('mongodb_auth', JSON.stringify({ token: data.token, user: data.user }));
      
      return { data: { user: data.user, session: { access_token: data.token } }, error: null };
    },

    signUp: async (credentials: { 
      email: string; 
      password: string; 
      options?: { 
        data?: Record<string, any>;
        emailRedirectTo?: string;
      } 
    }) => {
      const response = await fetch(`${this.apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          metadata: credentials.options?.data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      this.authToken = data.token;
      localStorage.setItem('mongodb_auth', JSON.stringify({ token: data.token, user: data.user }));
      
      return { 
        data: { 
          user: { ...data.user, email_confirmed_at: data.user.emailConfirmed ? new Date().toISOString() : null } 
        }, 
        error: null 
      };
    },

    signOut: async () => {
      this.authToken = null;
      localStorage.removeItem('mongodb_auth');
      return { error: null };
    },

    getSession: async () => {
      const storedAuth = localStorage.getItem('mongodb_auth');
      if (!storedAuth) {
        return { data: { session: null }, error: null };
      }

      const auth = JSON.parse(storedAuth);
      return { 
        data: { 
          session: { 
            access_token: auth.token, 
            user: auth.user 
          } 
        }, 
        error: null 
      };
    },

    getUser: async () => {
      if (!this.authToken) {
        return { data: { user: null }, error: null };
      }

      const response = await fetch(`${this.apiUrl}/auth/user`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` },
      });

      if (!response.ok) {
        return { data: { user: null }, error: new Error('Failed to get user') };
      }

      const data = await response.json();
      return { data: { user: data.user }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Initial check
      this.auth.getSession().then(({ data: { session } }) => {
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      });

      // Listen for storage changes (for multi-tab support)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'mongodb_auth') {
          const session = e.newValue ? JSON.parse(e.newValue) : null;
          callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener('storage', handleStorageChange);
            }
          }
        }
      };
    }
  };

  // Database query builder
  from(collection: string) {
    return new QueryBuilder(collection, this.apiUrl, this.authToken);
  }

  // Channel for real-time updates (placeholder - implement with WebSocket)
  channel(name: string) {
    return {
      on: (event: string, config: any, callback: (payload: any) => void) => {
        // Placeholder for real-time subscriptions
        return {
          subscribe: () => {}
        };
      }
    };
  }

  removeChannel(channel: any) {
    // Placeholder
  }
}

class QueryBuilder {
  private collection: string;
  private apiUrl: string;
  private authToken: string | null;
  private filters: Record<string, any> = {};
  private selectFields: string = '*';
  private orderBy: { field: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private singleResult: boolean = false;
  private maybeSingleResult: boolean = false;
  private pendingInsertData: any | null = null;
  private pendingUpdateData: any | null = null;

  constructor(collection: string, apiUrl: string, authToken: string | null) {
    this.collection = collection;
    this.apiUrl = apiUrl;
    this.authToken = authToken;
  }

  select(fields: string = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(field: string, value: any) {
    this.filters[field] = value;
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderBy = { field, ascending: options?.ascending ?? true };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  maybeSingle() {
    this.maybeSingleResult = true;
    return this;
  }

  insert(data: any | any[]) {
    this.pendingInsertData = data;
    const selectObj = {
      select: (fields: string = '*') => {
        return {
          single: () => this.executeInsert(data, true),
          then: (resolve: any) => this.executeInsert(data, false).then(resolve)
        };
      }
    };
    return selectObj as any;
  }

  private async executeInsert(data: any | any[], single: boolean = false) {
    const response = await fetch(`${this.apiUrl}/${this.collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      },
      body: JSON.stringify(Array.isArray(data) ? data : [data]),
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: new Error(error.message || 'Insert failed') };
    }

    const result = await response.json();
    const resultData = single && Array.isArray(result.data) ? result.data[0] : result.data;
    return { data: resultData, error: null };
  }

  update(data: any) {
    return {
      eq: (field: string, value: any) => {
        this.eq(field, value);
        return this.executeUpdate(data);
      }
    };
  }

  private async executeUpdate(data: any) {
    const queryParams = new URLSearchParams();
    Object.entries(this.filters).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    const response = await fetch(`${this.apiUrl}/${this.collection}?${queryParams}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: new Error(error.message || 'Update failed') };
    }

    const result = await response.json();
    return { data: result.data, error: null };
  }

  async then(resolve: (result: any) => void, reject?: (error: any) => void) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters
      Object.entries(this.filters).forEach(([key, value]) => {
        queryParams.append(`filter.${key}`, String(value));
      });

      // Add select fields
      if (this.selectFields !== '*') {
        queryParams.append('select', this.selectFields);
      }

      // Add ordering
      if (this.orderBy) {
        queryParams.append('orderBy', this.orderBy.field);
        queryParams.append('order', this.orderBy.ascending ? 'asc' : 'desc');
      }

      // Add limit
      if (this.limitCount) {
        queryParams.append('limit', String(this.limitCount));
      }

      const response = await fetch(`${this.apiUrl}/${this.collection}?${queryParams}`, {
        headers: {
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        const result = { data: null, error: new Error(error.message || 'Query failed'), count: null };
        resolve(result);
        return;
      }

      const result = await response.json();
      
      let data = result.data;
      
      // Handle single result
      if (this.singleResult) {
        data = data && data.length > 0 ? data[0] : null;
      } else if (this.maybeSingleResult) {
        data = data && data.length > 0 ? data[0] : null;
      }

      resolve({ 
        data, 
        error: null, 
        count: result.count || null 
      });
    } catch (error: any) {
      if (reject) {
        reject(error);
      } else {
        resolve({ data: null, error, count: null });
      }
    }
  }
}

export const mongodb = new MongoDBClient(MONGODB_API_URL);
