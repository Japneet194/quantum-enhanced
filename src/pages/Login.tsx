import * as React from 'react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState('arjun@example.com');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('Arjun');
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    try {
  if (mode === 'login') await login(email, password);
  else await register(name, email, password);
  navigate(from, { replace: true });
    } catch (e: any) { setErr(e.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">QEADS</h1>
        <p className="text-sm text-muted-foreground">Prefer social login? <a className="text-primary" href="/sign-in">Sign in with Clerk</a></p>
        {mode==='register' && (
          <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        )}
        <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={submit}>{mode==='login' ? 'Login' : 'Register'}</Button>
          <Button variant="outline" onClick={()=>setMode(mode==='login'?'register':'login')}>
            Switch to {mode==='login'?'Register':'Login'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
