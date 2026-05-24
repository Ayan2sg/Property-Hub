import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, clearAuthSession, isAdmin, ListingApprovalStatus } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Trash2 } from "lucide-react";

type ApprovalFilter = "all" | "pending" | "approved" | "rejected";

const approvalBadgeVariant: Record<ListingApprovalStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ApprovalFilter>("pending");

  useEffect(() => {
    if (!localStorage.getItem("token") || !isAdmin()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties", filter],
    queryFn: () => api.listAdminProperties(filter),
    enabled: isAdmin(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
    queryClient.invalidateQueries({ queryKey: ["buy-page-properties"] });
    queryClient.invalidateQueries({ queryKey: ["rent-page-properties"] });
  };

  const approve = useMutation({
    mutationFn: (id: string) => api.approveProperty(id),
    onSuccess: invalidate,
  });
  const reject = useMutation({
    mutationFn: (id: string) => api.rejectProperty(id),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.deleteProperty(id),
    onSuccess: invalidate,
  });

  const onLogout = () => {
    clearAuthSession();
    navigate("/admin/login");
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    remove.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Admin Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Property Listings</h1>
            <p className="text-muted-foreground text-sm">
              Review seller submissions, approve listings, or remove properties.
            </p>
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as ApprovalFilter)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All listings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading listings...</p>}

        {!isLoading && properties.length === 0 && (
          <p className="text-muted-foreground">No properties in this category.</p>
        )}

        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border border-border rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full md:w-32 h-24 object-cover rounded-md"
              />
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{property.title}</h2>
                  <Badge variant={approvalBadgeVariant[property.approvalStatus]}>
                    {property.approvalStatus}
                  </Badge>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{property.location}</p>
                <p className="font-medium">{property.price}</p>
                {property.listedBy && (
                  <p className="text-xs text-muted-foreground">
                    Listed by {property.listedBy.name} ({property.listedBy.email})
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {property.approvalStatus === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => approve.mutate(property.id)}
                      disabled={approve.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reject.mutate(property.id)}
                      disabled={reject.isPending}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {property.approvalStatus === "REJECTED" && (
                  <Button
                    size="sm"
                    onClick={() => approve.mutate(property.id)}
                    disabled={approve.isPending}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(property.id, property.title)}
                  disabled={remove.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
