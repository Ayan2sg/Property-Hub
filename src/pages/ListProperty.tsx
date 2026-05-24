import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const ListProperty = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    beds: 1,
    baths: 1,
    sqft: "",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    type: "SALE" as const,
    featured: false,
    amenities: [] as string[],
    availableFrom: "",
  });
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);
  const create = useMutation({
    mutationFn: () =>
      api.createProperty({
        ...form,
        amenities: amenitiesInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setError("");
      alert("Property submitted for admin approval. It will appear publicly once approved.");
      navigate("/properties");
    },
    onError: (e: any) => {
      setError(e?.message || "Failed to list property");
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">List a Property</h1>
        <div className="space-y-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Beds" value={form.beds} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} />
            <Input type="number" placeholder="Baths" value={form.baths} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} />
          </div>
          <Input placeholder="Size (e.g., 1,200 sq ft)" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} />
          <Input placeholder="Image path" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Input
            placeholder="Amenities (comma separated, e.g., wifi, parking, pool)"
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
          />
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">For Sale</SelectItem>
              <SelectItem value="RENT">For Rent</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Available From (optional)" value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? "Listing..." : "List Property"}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListProperty;


