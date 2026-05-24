export type PropertyType = "SALE" | "RENT";
export type UserRole = "USER" | "ADMIN";
export type ListingApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface PropertyDto {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  type: PropertyType;
  status: "AVAILABLE" | "SOLD" | "RENTED";
  approvalStatus: ListingApprovalStatus;
  featured: boolean;
  amenities: string[];
  availableFrom?: string | null;
  listedBy?: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export type PropertyStatus = "AVAILABLE" | "SOLD" | "RENTED";

export interface ListPropertiesQuery {
  type?: "all" | "SALE" | "RENT";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RazorpayOrderDto {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  propertyId: string;
}

export interface VerifyRazorpayPaymentBody {
  propertyId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ConfirmUpiPaymentBody {
  propertyId: string;
  utr: string;
}

function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl) return envUrl.replace(/\/$/, "");
  // In local dev, call backend directly to avoid proxy/env mismatch.
  if (import.meta.env.DEV) return "http://localhost:3001";
  return "";
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token') || undefined;
  const res = await fetch(`${getBaseUrl()}${path}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  signup: (body: { name: string; email: string; password: string }) =>
    http<{ token: string; user: UserDto }>(`/api/auth/signup`, { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    http<{ token: string; user: UserDto }>(`/api/auth/login`, { method: 'POST', body: JSON.stringify(body) }),
  adminLogin: (body: { email: string; password: string }) =>
    http<{ token: string; user: UserDto }>(`/api/auth/admin/login`, { method: 'POST', body: JSON.stringify(body) }),
  health: () => http<{ status: string; message: string }>(`/api/health`),
  listProperties: (query: ListPropertiesQuery = {}) => {
    const params = new URLSearchParams();
    if (query.type && query.type !== "all") params.set("type", query.type);
    if (query.search) params.set("search", query.search);
    if (typeof query.limit === "number") params.set("limit", String(query.limit));
    if (typeof query.offset === "number") params.set("offset", String(query.offset));
    const q = params.toString();
    return http<PropertyDto[]>(`/api/properties${q ? `?${q}` : ""}`);
  },
  getProperty: (id: string) => http<PropertyDto>(`/api/properties/${id}`),
  createProperty: (body: Omit<PropertyDto, 'id' | 'createdAt' | 'updatedAt' | 'status'>) =>
    http<PropertyDto>(`/api/properties`, { method: 'POST', body: JSON.stringify(body) }),
  purchaseProperty: (id: string) => http<PropertyDto>(`/api/properties/${id}/purchase`, { method: 'POST' }),
  listAdminProperties: (approval: "all" | "pending" | "approved" | "rejected" = "all") =>
    http<PropertyDto[]>(`/api/admin/properties?approval=${approval}`),
  approveProperty: (id: string) =>
    http<PropertyDto>(`/api/admin/properties/${id}/approve`, { method: 'PATCH' }),
  rejectProperty: (id: string) =>
    http<PropertyDto>(`/api/admin/properties/${id}/reject`, { method: 'PATCH' }),
  deleteProperty: (id: string) =>
    http<{ message: string }>(`/api/admin/properties/${id}`, { method: 'DELETE' }),
  createRazorpayOrder: (propertyId: string) =>
    http<RazorpayOrderDto>(`/api/payments/razorpay/order`, { method: "POST", body: JSON.stringify({ propertyId }) }),
  verifyRazorpayPayment: (body: VerifyRazorpayPaymentBody) =>
    http<{ success: boolean; property: PropertyDto }>(`/api/payments/razorpay/verify`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  confirmUpiPayment: (body: ConfirmUpiPaymentBody) =>
    http<{ success: boolean; property: PropertyDto }>(`/api/payments/upi/confirm`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function isAdmin() {
  return localStorage.getItem("userRole") === "ADMIN";
}

export function setAuthSession(token: string, role: UserRole) {
  localStorage.setItem("token", token);
  localStorage.setItem("userRole", role);
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
}


