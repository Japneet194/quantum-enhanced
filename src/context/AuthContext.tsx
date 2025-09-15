import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultApi } from '@/api/client';
import type { LoginResponse, UserPayload } from '@/api/types';

interface AuthCtx {
  user: UserPayload | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('qeads_token'));
  const [user, setUser] = useState<UserPayload | null>(() => {
    const s = localStorage.getItem('qeads_user');
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('qeads_token', token); else localStorage.removeItem('qeads_token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('qeads_user', JSON.stringify(user)); else localStorage.removeItem('qeads_user');
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await defaultApi.post<LoginResponse>('/auth/login', { email, password });
    setToken(res.token); setUser(res.user);
  };
  const register = async (name: string, email: string, password: string) => {
    const res = await defaultApi.post<LoginResponse>('/auth/register', { name, email, password });
    setToken(res.token); setUser(res.user);
  };
  const logout = () => { setToken(null); setUser(null); };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
