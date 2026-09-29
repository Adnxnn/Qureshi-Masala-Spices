"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  getCurrentUser,
  placeOrder,
  updateUserProfile,
  validateAndApplyPromoCode,
} from "@/lib/actions";
import { calculateOrderTotal } from "@/lib/utils";
import type { CartItem, PlaceOrderPayload, User } from "@/types";

const WHATSAPP_NUMBER = "918762117816";

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name"),

  customer_phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{10,16}$/, "Enter a valid phone number")
    .refine(value => value.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),

  customer_email: z.string().trim().email("Enter a valid email address"),

  customer_address: z
    .string()
    .trim()
    .min(10, "Enter your complete delivery address"),

  customer_city: z.string().trim().min(2, "Enter your city"),

  customer_pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),

  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type OrderTotals = {
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
};

function formatWeight(grams: number) {
  if (grams >= 1000) {
    return `${grams / 1000}kg`;
  }

  return `${grams}g`;
}

function CheckoutInput({
  id,
  label,
  placeholder,
  type = "text",
  autoComplete,
  register,
  errors,
}: {
  id: keyof CheckoutFormData;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}) {
  const error = errors[id];

  return (
    <div className="min-w-0 space-y-2">
      <label
        htmlFor={id}
        className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d7c8b3]/55"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={id === "customer_pincode" ? "numeric" : type === "tel" ? "tel" : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? id + "-error" : undefined}
        placeholder={placeholder}
        {...register(id)}
        className={`min-h-12 w-full min-w-0 rounded-xl border bg-[#11100f] px-4 text-sm text-[#f5efe6] outline-none transition-colors placeholder:text-[#f5efe6]/20 ${
          error
            ? "border-red-400/50 focus:border-red-400"
            : "border-white/10 focus:border-[#c9a45f]/70"
        }`}
      />

      {error && <p id={id + "-error"} role="alert" className="text-[12px] text-red-300">{error.message}</p>}
    </div>
  );
}

function CartProductRow({
  item,
  updateQuantity,
  removeProduct,
}: {
  item: CartItem;
  updateQuantity: (productId: string, weight: number, quantity: number) => void;
  removeProduct: (productId: string, weight: number) => void;
}) {
  const { product, variant, quantity } = item;
  const allItems = useCart(state => state.items);
  const atLimit = allItems.filter(row => row.product.id === product.id).reduce((sum, row) => sum + row.quantity, 0) >= product.stock_qty;

  return (
    <article className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)_auto] gap-x-3 gap-y-3 border-b border-white/[0.07] py-4 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#211611] to-[#0d0c0b] sm:h-[72px] sm:w-[72px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,164,95,0.12),transparent_70%)]" />

        <Image
          src={product.image_url}
          alt={product.name}
          width={72}
          height={72}
          className="relative h-full w-full object-contain p-1.5"
        />
      </div>

      <div className="min-w-0">
        <h3 className="break-words text-sm font-semibold text-[#f5efe6] sm:text-base">
          {product.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[12px] font-medium uppercase tracking-[0.12em] text-[#f5efe6]/70">
            {formatWeight(variant.weight_grams)}
          </span>

          <span className="text-[12px] text-[#f5efe6]/70">
            ₹{variant.price} each
          </span>
        </div>
      </div>

      <p className="shrink-0 text-right font-display text-lg text-[#d9b56f] sm:order-4 sm:min-w-[75px]">
        ₹{variant.price * quantity}
      </p>

      <div className="col-span-2 col-start-2 flex items-center justify-between gap-3 sm:col-span-1 sm:col-start-auto sm:order-3 sm:justify-start">
        <div className="flex shrink-0 items-center rounded-lg border border-white/10 bg-black/30 p-1">
          <button
            type="button"
            aria-label={`Decrease ${product.name} quantity`}
            onClick={() =>
              updateQuantity(product.id, variant.weight_grams, quantity - 1)
            }
            className="flex h-11 w-11 items-center justify-center rounded-md text-[#f5efe6]/70 transition-colors hover:bg-white/5 hover:text-[#d9b56f]"
          >
            <Minus size={12} />
          </button>

          <span className="w-7 text-center text-xs font-bold text-[#f5efe6]">
            {quantity}
          </span>

          <button
            type="button"
            aria-label={`Increase ${product.name} quantity`}
            disabled={atLimit}
            onClick={() =>
              updateQuantity(product.id, variant.weight_grams, quantity + 1)
            }
            className="flex h-11 w-11 items-center justify-center rounded-md text-[#f5efe6]/70 transition-colors hover:bg-white/5 hover:text-[#d9b56f]"
          >
            <Plus size={12} />
          </button>
        </div>

        <button
          type="button"
          aria-label={`Remove ${product.name}`}
          onClick={() => removeProduct(product.id, variant.weight_grams)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-[#f5efe6]/25 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}

function OrderSuccess({
  orderId,
  orderData,
  orderItems,
  orderTotals,
  openWhatsApp,
}: {
  orderId: string;
  orderData: CheckoutFormData;
  orderItems: CartItem[];
  orderTotals: OrderTotals | null;
  openWhatsApp: () => void;
}) {
  return (
    <div className="royal-page royal-grain relative min-h-screen w-full overflow-x-hidden pb-16 pt-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="royal-panel rounded-2xl p-5 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10 text-green-300">
              <CheckCircle2 size={36} />
            </div>

            <p className="mb-3 text-sm font-semibold tracking-normal text-[#c9a45f]">
              Order request received
            </p>

            <h1 className="royal-title text-5xl sm:text-6xl">
              Thank you.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#f5efe6]/70">
              Your order has been saved. Continue to WhatsApp so we can confirm
              availability and delivery.
            </p>

            <div className="mx-auto mt-5 inline-flex rounded-full border border-[#c9a45f]/20 bg-[#c9a45f]/10 px-4 py-2 font-mono text-xs tracking-wider text-[#d9b56f]">
              Order #{orderId}
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={`${item.product.id}-${item.variant.weight_grams}`}
                className="flex min-w-0 items-center gap-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#f5efe6]">
                    {item.product.name}
                  </p>

                  <p className="text-[12px] text-[#f5efe6]/70">
                    {formatWeight(item.variant.weight_grams)} × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-[#d9b56f]">
                  ₹{item.variant.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-white/10" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-normal text-[#f5efe6]/70">
              Product total · delivery extra
            </span>

            <span className="font-display text-3xl text-[#d9b56f]">
              ₹{orderTotals?.total.toFixed(0) || "0"}
            </span>
          </div>

          <button
            type="button"
            onClick={openWhatsApp}
            className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#278c4d] px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#31a75c]"
          >
            <MessageCircle size={18} />
            Confirm on WhatsApp
          </button>

          <Link
            href="/shop"
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 text-xs font-bold uppercase tracking-[0.16em] text-[#f5efe6]/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    totalAmount,
    appliedPromoCode,
    applyPromoCode,
  } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<CheckoutFormData | null>(null);
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>([]);
  const [lastOrderTotals, setLastOrderTotals] = useState<OrderTotals | null>(
    null,
  );
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const subtotal = totalAmount();

  const currentTotals = calculateOrderTotal(
    subtotal,
    appliedPromoCode,
  ) as OrderTotals;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      customer_address: "",
      customer_city: "",
      customer_pincode: "",
      notes: "",
    },
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        if (userData) {
          reset({
            customer_name: userData.full_name || "",
            customer_email: userData.email || "",
            customer_phone: userData.phone || "",
            customer_address: userData.address || "",
            customer_city: userData.city || "",
            customer_pincode: userData.pincode || "",
            notes: "",
          });
        }
      } catch (error) {
        console.error("Unable to load customer details:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, [reset]);

  const createWhatsAppMessage = (
    customer: CheckoutFormData,
    generatedOrderId: string,
    orderItems: CartItem[],
    totals: OrderTotals,
  ) => {
    const products = orderItems
      .map(
        (item) =>
          `• ${item.product.name} (${formatWeight(
            item.variant.weight_grams,
          )}) × ${item.quantity} = ₹${item.variant.price * item.quantity}`,
      )
      .join("\n");

    return encodeURIComponent(
      `🛒 NEW ORDER

Order ID: ${generatedOrderId}

Customer Details:
Name: ${customer.customer_name}
Phone: ${customer.customer_phone}
Email: ${customer.customer_email}

Delivery Address:
${customer.customer_address}
${customer.customer_city} - ${customer.customer_pincode}

Products:
${products}

${totals.discount > 0 ? `Discount: -₹${totals.discount}\n` : ""}Product total (delivery extra): ₹${totals.total}

${customer.notes ? `Notes: ${customer.notes}` : ""}

Please confirm this order.`,
    );
  };

  const openWhatsApp = () => {
    if (!whatsappMessage) return;

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
  };

  const handleApplyPromo = async () => {
    const code = promoInput.trim();

    if (!code) return;

    setApplyingPromo(true);
    setPromoError("");

    try {
      const promoCode = await validateAndApplyPromoCode(code);

      if (!promoCode) {
        setPromoError("Invalid or expired promo code");
        return;
      }

      applyPromoCode(promoCode);
      setPromoInput("");
      toast.success("Promo code applied");
    } catch (error) {
      console.error("Promo code error:", error);
      setPromoError("Unable to apply this promo code");
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    applyPromoCode(null);
    toast.success("Promo code removed");
  };

  const onSubmit = async (customer: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const currentItems = [...items];

    const currentSubtotal = currentItems.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0,
    );

    try {
      if (user) {
        try {
          await updateUserProfile({
            full_name: customer.customer_name,
            phone: customer.customer_phone,
            address: customer.customer_address,
            city: customer.customer_city,
            pincode: customer.customer_pincode,
          });
        } catch (error) {
          console.warn("Unable to update profile:", error);
        }
      }

      const payload: PlaceOrderPayload = {
        customer_name: customer.customer_name,
        customer_phone: customer.customer_phone,
        customer_email: customer.customer_email,
        customer_address: customer.customer_address,
        customer_city: customer.customer_city,
        customer_pincode: customer.customer_pincode,
        notes: customer.notes,
        items: currentItems,
      };

      const result = await placeOrder(payload, appliedPromoCode);

      if (result.success === false) {
        toast.error(result.error);
        return;
      }

      const generatedOrderId = String(result.order.id);
      const confirmedTotal = Number(result.order.total_amount);
      const confirmedTotals: OrderTotals = {
        subtotal: currentSubtotal,
        deliveryCharge: 0,
        discount: Math.max(currentSubtotal - confirmedTotal, 0),
        total: confirmedTotal,
      };

      const message = createWhatsAppMessage(
        customer,
        generatedOrderId,
        currentItems,
        confirmedTotals,
      );

      setOrderId(generatedOrderId);
      setOrderData(customer);
      setLastOrderItems(currentItems);
      setLastOrderTotals(confirmedTotals);
      setWhatsappMessage(message);
      setSubmitted(true);
      clearCart();

      window.setTimeout(() => {
        window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      }, 700);
    } catch (error) {
      console.error("Order failed:", error);

      toast.error("We could not place your order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="royal-page flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#c9a45f]" />

          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/65">
            Preparing your cart
          </p>
        </div>
      </div>
    );
  }

  if (submitted && orderData) {
    return (
      <OrderSuccess
        orderId={orderId}
        orderData={orderData}
        orderItems={lastOrderItems}
        orderTotals={lastOrderTotals}
        openWhatsApp={openWhatsApp}
      />
    );
  }

  return (
    <div className="checkout-page royal-page relative min-h-screen w-full overflow-x-hidden pb-32 pt-6 sm:pt-10 lg:pb-16">
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-5 sm:mb-7">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#c9a45f]"><Sparkles size={15} /> From our shelves to your kitchen</p>
          <h1 className="royal-title text-4xl sm:text-6xl">Your cart &amp; delivery</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#f5efe6]/70">Review your spices, enter your address, and send your order request. We confirm delivery and payment on WhatsApp.</p>
        </header>
        <div className="checkout-guidance"><Link href="/shop"><ArrowLeft size={16} /> Keep exploring</Link><span>No payment is collected on this website.</span><Link href="/contact">Need a hand? <MessageCircle size={16} /></Link></div>
        {items.length === 0 ? (
          <div className="royal-panel mx-auto mt-6 flex max-w-xl flex-col items-center rounded-2xl px-5 py-12 text-center">
            <ShoppingBag size={38} className="text-[#c9a45f]" />
            <h2 className="royal-title mt-4 text-4xl">Your cart is empty.</h2>
            <p className="mt-2 text-sm leading-6 text-[#f5efe6]/70">Find a blend for your next meal and it will appear here.</p>
            <Link href="/shop" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#c9a45f] px-6 font-semibold text-[#130d08]">Explore spices <ChevronRight size={16} /></Link>
          </div>
        ) : (
          <form id="delivery-checkout-form" onSubmit={handleSubmit(onSubmit)} className="mt-5 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start lg:gap-7">
            <div className="min-w-0 space-y-5 lg:col-span-7">
              <section className="royal-panel overflow-hidden rounded-2xl" aria-labelledby="cart-heading">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
                  <div><h2 id="cart-heading" className="font-display text-2xl text-[#f5efe6]">Your spices</h2><p className="text-xs text-[#f5efe6]/65">{items.reduce((n, item) => n + item.quantity, 0)} packs · adjust your selection here</p></div>
                  <ShoppingBag size={21} className="text-[#c9a45f]" />
                </div>
                <div className="px-4 sm:px-6">{items.map(item => <CartProductRow key={`${item.product.id}-${item.variant.weight_grams}`} item={item} updateQuantity={updateQty} removeProduct={removeItem} />)}</div>
                <Link href="/shop" className="inline-flex min-h-11 items-center gap-2 px-4 pb-3 text-sm text-[#d9b56f] sm:px-6">+ Add more spices</Link>
              </section>
              <section className="royal-panel overflow-hidden rounded-2xl" aria-labelledby="details-heading">
                <div className="border-b border-white/10 px-4 py-4 sm:px-6"><h2 id="details-heading" className="flex items-center gap-2 font-display text-2xl text-[#f5efe6]"><MapPin size={19} className="text-[#c9a45f]" /> Delivery details</h2><p className="mt-1 text-xs text-[#f5efe6]/65">We use these details to prepare your order request.</p></div>
                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                  <CheckoutInput id="customer_name" label="Full name" placeholder="Your full name" autoComplete="name" register={register} errors={errors} />
                  <CheckoutInput id="customer_phone" label="Phone / WhatsApp" type="tel" placeholder="+91 98765 43210" autoComplete="tel" register={register} errors={errors} />
                  <div className="sm:col-span-2"><CheckoutInput id="customer_email" label="Email address" type="email" placeholder="you@email.com" autoComplete="email" register={register} errors={errors} /></div>
                  <div className="min-w-0 space-y-2 sm:col-span-2"><label htmlFor="customer_address" className="block text-xs font-semibold uppercase tracking-wider text-[#d7c8b3]/70">Complete delivery address</label><textarea id="customer_address" rows={3} autoComplete="street-address" placeholder="House number, street, landmark and area" aria-invalid={!!errors.customer_address} aria-describedby={errors.customer_address ? 'customer_address-error' : undefined} {...register('customer_address')} className="w-full min-w-0 rounded-xl border border-white/10 bg-[#11100f] px-4 py-3 text-sm text-[#f5efe6] outline-none focus:border-[#c9a45f]" />{errors.customer_address && <p id="customer_address-error" role="alert" className="text-xs text-red-300">{errors.customer_address.message}</p>}</div>
                  <CheckoutInput id="customer_city" label="City" placeholder="Your city" autoComplete="address-level2" register={register} errors={errors} />
                  <CheckoutInput id="customer_pincode" label="Pincode" placeholder="6-digit pincode" autoComplete="postal-code" register={register} errors={errors} />
                  <div className="min-w-0 space-y-2 sm:col-span-2"><label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-[#d7c8b3]/70">Order notes <span className="normal-case tracking-normal">(optional)</span></label><textarea id="notes" rows={2} placeholder="Delivery instructions or anything we should know" {...register('notes')} className="w-full min-w-0 rounded-xl border border-white/10 bg-[#11100f] px-4 py-3 text-sm text-[#f5efe6] outline-none focus:border-[#c9a45f]" /></div>
                </div>
              </section>
              {!user && <p className="px-1 text-sm text-[#f5efe6]/65">Returning customer? <Link href="/login" className="text-[#d9b56f] underline underline-offset-4">Sign in</Link> to fill saved details, or continue as a guest.</p>}
            </div>
            <aside className="min-w-0 lg:sticky lg:top-24 lg:col-span-5">
              <div className="royal-panel overflow-hidden rounded-2xl" aria-labelledby="summary-heading">
                <div className="border-b border-white/10 bg-[#c9a45f]/[0.07] px-5 py-4"><h2 id="summary-heading" className="font-display text-2xl text-[#f5efe6]">Order summary</h2><p className="mt-1 text-xs text-[#f5efe6]/65">Your product total before delivery.</p></div>
                <div className="space-y-5 p-5">
                  {appliedPromoCode ? <div className="flex items-center justify-between gap-3 rounded-xl border border-green-400/20 bg-green-400/[0.06] px-3 py-2 text-sm text-green-200"><span>Code {appliedPromoCode.code} applied</span><button type="button" onClick={handleRemovePromo} className="min-h-10 px-2 underline">Remove</button></div> : <div className="space-y-2"><label htmlFor="promo-code" className="block text-xs font-semibold text-[#f5efe6]/70">Have a promo code?</label><div className="flex gap-2"><input id="promo-code" value={promoInput} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void handleApplyPromo() } }} onChange={event => { setPromoInput(event.target.value); setPromoError('') }} placeholder="Enter code" className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-[#c9a45f]" /><button type="button" disabled={applyingPromo} onClick={handleApplyPromo} className="min-h-11 rounded-xl border border-[#c9a45f]/40 px-4 text-sm text-[#d9b56f] disabled:opacity-40">{applyingPromo ? 'Checking' : 'Apply'}</button></div>{promoError && <p role="alert" className="text-xs text-red-300">{promoError}</p>}</div>}
                  <div className="space-y-3 border-t border-white/10 pt-4 text-sm"><div className="flex justify-between text-[#f5efe6]/70"><span>Spices subtotal</span><span>₹{currentTotals.subtotal.toLocaleString('en-IN')}</span></div>{currentTotals.discount > 0 && <div className="flex justify-between text-green-300"><span>Discount</span><span>−₹{currentTotals.discount.toLocaleString('en-IN')}</span></div>}<div className="flex items-end justify-between gap-3 border-t border-white/10 pt-4"><strong className="text-[#f5efe6]">Product total</strong><strong className="font-display text-3xl text-[#e0bd77]">₹{currentTotals.total.toLocaleString('en-IN')}</strong></div><p className="text-xs leading-5 text-[#f5efe6]/65">Delivery availability, charge and timing are confirmed with you on WhatsApp before payment.</p></div>
                  <button type="submit" disabled={isSubmitting} className="hidden min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#278c4d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#31a75c] disabled:opacity-50 lg:flex"><MessageCircle size={18} />{isSubmitting ? 'Sending order request...' : 'Send order request'}</button>
                  <p className="text-center text-xs leading-5 text-[#f5efe6]/60">No payment is collected here. Our team confirms the order on WhatsApp.</p>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
      {items.length > 0 && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0a09]/95 px-4 pt-2 shadow-[0_-16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden" style={{paddingBottom:'calc(0.5rem + env(safe-area-inset-bottom))'}}><div className="mx-auto flex max-w-6xl items-center gap-3"><div className="min-w-0 flex-1"><p className="text-xs text-[#f5efe6]/70">Products · delivery extra</p><p className="font-display text-xl text-[#e0bd77]">₹{currentTotals.total.toLocaleString('en-IN')}</p></div><button type="submit" form="delivery-checkout-form" disabled={isSubmitting} className="min-h-12 rounded-xl bg-[#278c4d] px-4 text-sm font-semibold text-white disabled:opacity-50">{isSubmitting ? 'Sending...' : 'Send order request'}</button></div></div>}
    </div>
  );
}
