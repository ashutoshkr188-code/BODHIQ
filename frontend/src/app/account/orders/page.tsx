import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { authedServerFetch } from "@/lib/apiClient";
import { Package, ShoppingBag, Eye } from "lucide-react";
import InvoiceGenerator from "@/features/orders/components/InvoiceGenerator";
import type { Order } from "@/types/api";

const statusStyles: Record<string, string> = {
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  delivered: "bg-[#d4a853]/10 text-[#d4a853] border-[#d4a853]/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

function getStatusStyle(status: string) {
  return (
    statusStyles[status.toLowerCase()] ||
    "bg-white/5 text-gray-300 border-white/10"
  );
}

export default async function YourOrdersPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-4">Please sign in</h1>
          <p className="text-gray-400">
            You need to be signed in to view your orders.
          </p>
        </div>
      </main>
    );
  }

  // Obtain Clerk JWT and fetch orders from FastAPI
  const token = await getToken();
  const orders = token
    ? await authedServerFetch<Order[]>("/orders", token)
    : null;

  const orderList = orders ?? [];

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link
            href="/account"
            className="text-xs uppercase tracking-[0.3em] text-gray-500 hover:text-[#d4a853] transition-colors mb-6 inline-block"
          >
            ← Account
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-[#d4a853] mb-3">
            Orders
          </p>
          <h1 className="text-3xl md:text-5xl font-serif">Your Orders</h1>
          <p className="text-gray-400 mt-3">
            Track your purchases and review order details.
          </p>
        </div>

        {orderList.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#d4a853]/3 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl border border-[#d4a853]/15 bg-[#d4a853]/5 flex items-center justify-center text-[#d4a853] mx-auto mb-6">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-2xl font-serif mb-3">No Orders Yet</h2>
              <p className="text-gray-500 text-sm leading-7 max-w-md mx-auto mb-8">
                Your order history will appear here once you&apos;ve made your
                first purchase. Explore our collection to find your perfect
                timepiece.
              </p>
              <Link
                href="/collection"
                className="inline-block px-8 py-3 border border-[#d4a853] text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-[#d4a853] hover:text-black transition duration-300"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orderList.map((order) => {
              const firstItem = order.cart_items?.[0];
              const itemCount =
                order.cart_items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

              // Adapt for InvoiceGenerator (expects _id + camelCase fields)
              const invoiceOrder = {
                _id: order.id,
                orderNumber: order.order_number,
                amount: order.amount,
                currency: order.currency,
                status: order.status,
                createdAt: order.created_at,
                cartItems: order.cart_items ?? [],
                shippingAddress: order.shipping_address ?? undefined,
                razorpayOrderId: order.razorpay_order_id ?? "",
                razorpayPaymentId: order.razorpay_payment_id ?? "",
                customerName: order.customer_name,
                customerEmail: order.customer_email,
              };

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/5 bg-white/2 p-5 md:p-6 hover:bg-white/4 hover:border-[#d4a853]/15 transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-full border ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <span className="text-xs text-gray-600 font-mono">
                      {order.order_number}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl border border-white/5 bg-white/3 flex items-center justify-center text-[#d4a853]/40 shrink-0">
                      <Package size={20} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-[15px] font-medium text-white truncate">
                        {firstItem?.name || "Order Item"}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        {itemCount} {itemCount === 1 ? "item" : "items"} • ₹
                        {order.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-5 border-t border-white/5">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="w-full sm:w-auto px-6 py-2.5 border border-[#d4a853]/30 text-[#d4a853] rounded-full text-xs uppercase tracking-widest hover:bg-white/5 transition flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>

                    <div className="w-full sm:w-auto">
                      <InvoiceGenerator
                        order={invoiceOrder}
                        variant="outline"
                        buttonText="Download Invoice"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
