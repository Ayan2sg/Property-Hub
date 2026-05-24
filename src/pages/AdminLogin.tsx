import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api, setAuthSession } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { Shield } from "lucide-react";

const AdminLogin = () => {
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
      const res = await api.adminLogin({ email, password });
      setAuthSession(res.token, res.user.role);
      navigate("/admin");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-xl p-8 space-y-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Approve listings and manage properties</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" onClick={onSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign in as Admin"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            <Link to="/" className="text-primary hover:underline">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
