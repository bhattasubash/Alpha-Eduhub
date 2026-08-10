"use client";

import { useTransition } from "react";
import { CreditCard, Loader2, Save } from "lucide-react";
import { updateSubscription } from "@/lib/superAdminActions";
import { toast } from "react-toastify";

interface Props {
  schoolId:      string;
  currentPlan:   string;
  currentStatus: string;
  expiresAt:     string;
}

export default function SubscriptionForm({ schoolId, currentPlan, currentStatus, expiresAt }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("schoolId", schoolId);
    startTransition(async () => {
      const result = await updateSubscription({ success: false, error: false }, formData);
      if (result.success) {
        toast.success("Subscription updated!");
      } else {
        toast.error(result.message ?? "Failed to update subscription");
      }
    });
  }

  const planDetails = {
    FREE:         { price: "₹0",     students: "Up to 100",    storage: "256MB"  },
    STARTER:      { price: "₹25/mo", students: "Up to 300",    storage: "1GB"    },
    PROFESSIONAL: { price: "₹30/mo", students: "Up to 1,500",  storage: "5GB"    },
    ENTERPRISE:   { price: "Custom", students: "Unlimited",     storage: "Unlimited" },
  };

  return (
    <div className="max-w-lg space-y-5">
      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(planDetails).map(([plan, details]) => (
          <div
            key={plan}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              currentPlan === plan
                ? "border-purple-500/40 bg-purple-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/8"
            }`}
          >
            <p className="text-white/80 text-sm font-semibold">{plan}</p>
            <p className="text-purple-400 text-lg font-bold mt-1">{details.price}</p>
            <p className="text-white/30 text-xs mt-1">{details.students} students</p>
            <p className="text-white/30 text-xs">{details.storage} storage</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-5">
          <CreditCard className="w-5 h-5 text-purple-400" />
          <h2 className="text-white font-semibold">Update Subscription</h2>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Plan</label>
            <select name="plan" defaultValue={currentPlan}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer">
              <option value="FREE">Free</option>
              <option value="STARTER">Starter — ₹25/mo</option>
              <option value="PROFESSIONAL">Professional — ₹30/mo</option>
              <option value="ENTERPRISE">Enterprise — Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Status</label>
            <select name="status" defaultValue={currentStatus}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer">
              <option value="TRIAL">Trial</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Expiry Date</label>
            <input name="expiresAt" type="date"
              defaultValue={expiresAt ? new Date(expiresAt).toISOString().split("T")[0] : ""}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-60"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Updating…" : "Update Subscription"}
          </button>
        </form>
      </div>
    </div>
  );
}
