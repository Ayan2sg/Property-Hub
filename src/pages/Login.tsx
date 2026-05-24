import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api, setAuthSession } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit() {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.login({ email, password });
      setAuthSession(res.token, res.user.role);
      navigate('/list');
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <div className="space-y-4">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={onSubmit} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          <p className="text-sm text-muted-foreground">No account? <Link to="/signup" className="text-primary">Sign up</Link></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;


