import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function getNumericAmount(price: string) {
  const amount = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

const Checkout = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [utr, setUtr] = useState("");
  const upiId = (import.meta.env.VITE_UPI_ID as string | undefined)?.trim();
  const upiPayeeName = (import.meta.env.VITE_UPI_PAYEE_NAME as string | undefined)?.trim() || "Prop Haven";
  const { data: property } = useQuery({ queryKey: ["property", id], queryFn: () => api.getProperty(id), enabled: !!id });

  const verifyPayment = useMutation({
    mutationFn: api.verifyRazorpayPayment,
    onSuccess: () => {
      alert("Payment successful. Booking confirmed.");
      navigate("/properties");
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "Failed to verify Razorpay payment.");
    },
    onSettled: () => setIsPaying(false),
  });
  const confirmUpi = useMutation({
    mutationFn: api.confirmUpiPayment,
    onSuccess: () => {
      alert("UPI payment marked as confirmed. Booking completed.");
      navigate("/properties");
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "UPI confirmation failed.");
    },
  });

  useEffect(() => {
    if (!id) navigate("/properties");
    if (!localStorage.getItem("token")) navigate("/login");
  }, [id, navigate]);

  const unavailable = property && property.status !== "AVAILABLE";
  const amount = property ? getNumericAmount(property.price) : 0;
  const upiPaymentLink =
    property && upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiPayeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`${property.type === "RENT" ? "Rent" : "Property Purchase"} - ${property.title}`)}`
      : "";
  const upiQrUrl = upiPaymentLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiPaymentLink)}`
    : "";

  const handlePay = async () => {
    if (!id || !property || unavailable || isPaying) return;
    setIsPaying(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout. Please try again.");
      }

      const order = await api.createRazorpayOrder(id);
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Prop Haven",
        description: `${property.type === "RENT" ? "Rent" : "Purchase"} payment for ${property.title}`,
        order_id: order.orderId,
        handler: (response: unknown) => {
          const payment = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          verifyPayment.mutate({
            propertyId: id,
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          });
        },
        prefill: {},
        theme: { color: "#4f46e5" },
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setIsPaying(false);
    }
  };
  const handleUpiPay = () => {
    if (!upiPaymentLink) {
      alert("UPI is not configured. Add VITE_UPI_ID in frontend .env.");
      return;
    }
    window.location.href = upiPaymentLink;
  };
  const handleConfirmUpi = () => {
    if (!id || !utr.trim()) {
      alert("Please enter UTR / transaction reference.");
      return;
    }
    confirmUpi.mutate({ propertyId: id, utr: utr.trim() });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {property ? (
          <div className="border border-border rounded-lg p-4 space-y-2">
            <div className="text-lg font-semibold">{property.title}</div>
            <div className="text-muted-foreground">{property.location}</div>
            <div className="font-bold">{property.price}{property.type === 'RENT' ? ' / month' : ''}</div>
          </div>
        ) : (
          <div className="text-muted-foreground">Loading property...</div>
        )}
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="font-semibold">Payment</div>
          <Button className="w-full" onClick={handlePay} disabled={isPaying || verifyPayment.isPending || !!unavailable}>
            {isPaying || verifyPayment.isPending ? 'Processing...' : unavailable ? `Already ${property?.status}` : 'Pay with Razorpay'}
          </Button>
          {!unavailable && property && (
            <div className="pt-2 space-y-3 border-t border-border">
              <div className="text-sm font-medium">Or pay directly with UPI</div>
              {upiQrUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={upiQrUrl} alt="UPI QR Code" className="w-52 h-52 rounded border border-border" />
                  <div className="text-xs text-muted-foreground text-center">
                    Scan this QR in any UPI app, or use the button below on mobile.
                  </div>
                </div>
              ) : (
                <div className="text-xs text-destructive">UPI is not configured yet. Add `VITE_UPI_ID` in `.env`.</div>
              )}
              <Button className="w-full" variant="outline" onClick={handleUpiPay} disabled={!upiQrUrl}>
                Do UPI Payment
              </Button>
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Enter UTR / Transaction ID after payment"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
                <Button className="w-full" onClick={handleConfirmUpi} disabled={confirmUpi.isPending || !utr.trim()}>
                  {confirmUpi.isPending ? "Confirming..." : "I Have Paid (Confirm UPI)"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;


