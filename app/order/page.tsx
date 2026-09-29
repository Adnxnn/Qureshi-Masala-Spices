"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Gift, MapPin, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getCurrentUser, placeOrder, updateUserProfile, validateAndApplyPromoCode } from "@/lib/actions";
import { calculateOrderTotal } from "@/lib/utils";
import type { CartItem, PlaceOrderPayload, PromoCode, User } from "@/types";
import styles from "./OrderPage.module.css";

const WHATSAPP_NUMBER = "918762117816";
const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name"),
  customer_phone: z.string().trim().regex(/^\+?[0-9\s-]{10,16}$/, "Enter a valid phone number").refine(value => value.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
  customer_email: z.string().trim().email("Enter a valid email address"),
  customer_address: z.string().trim().min(10, "Enter your complete delivery address"),
  customer_city: z.string().trim().min(2, "Enter your city"),
  customer_pincode: z.string().trim().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().optional(),
});
type CheckoutFormData = z.infer<typeof checkoutSchema>;
type OrderTotals = { subtotal: number; deliveryCharge: number; discount: number; total: number };
const money = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const formatWeight = (grams: number) => grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;

function CheckoutInput({ id, label, placeholder, type = "text", autoComplete, register, errors }: {
  id: keyof CheckoutFormData; label: string; placeholder: string; type?: string; autoComplete?: string;
  register: UseFormRegister<CheckoutFormData>; errors: FieldErrors<CheckoutFormData>;
}) {
  const error = errors[id];
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <input id={id} type={type} autoComplete={autoComplete} inputMode={id === "customer_pincode" ? "numeric" : type === "tel" ? "tel" : undefined}
      aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} placeholder={placeholder} {...register(id)} />
    {error && <p id={`${id}-error`} role="alert" className={styles.error}>{error.message}</p>}
  </div>;
}

function CartProductRow({ item, updateQuantity, removeProduct }: {
  item: CartItem; updateQuantity: (productId: string, weight: number, quantity: number) => void;
  removeProduct: (productId: string, weight: number) => void;
}) {
  const { product, variant, quantity } = item;
  const allItems = useCart(state => state.items);
  const atLimit = allItems.filter(row => row.product.id === product.id).reduce((sum, row) => sum + row.quantity, 0) >= product.stock_qty;
  return <article className={styles.productRow}>
    <div className={styles.productImage}><Image src={product.image_url} alt={product.name} width={110} height={130} /></div>
    <div className={styles.productInfo}>
      <h3>{product.name}</h3>
      <p>{formatWeight(variant.weight_grams)} pack <span aria-hidden="true">·</span> {money(variant.price)} each</p>
      <button type="button" className={styles.remove} aria-label={`Remove ${product.name}`} onClick={() => removeProduct(product.id, variant.weight_grams)}><Trash2 size={14} /> Remove</button>
    </div>
    <div className={styles.productActions}>
      <div className={styles.quantity} aria-label={`Quantity for ${product.name}`}>
        <button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => updateQuantity(product.id, variant.weight_grams, quantity - 1)}><Minus size={16} /></button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" aria-label={`Increase ${product.name} quantity`} disabled={atLimit} onClick={() => updateQuantity(product.id, variant.weight_grams, quantity + 1)}><Plus size={16} /></button>
      </div>
      <strong>{money(variant.price * quantity)}</strong>
    </div>
  </article>;
}

function OrderSuccess({ orderId, orderItems, orderTotals, openWhatsApp }: {
  orderId: string; orderItems: CartItem[]; orderTotals: OrderTotals | null; openWhatsApp: () => void;
}) {
  return <main className={styles.page}>
    <div className={styles.success}>
      <span className={styles.successIcon}><CheckCircle2 size={38} /></span>
      <p className={styles.kicker}>ORDER REQUEST RECEIVED</p>
      <h1>Thank you.<br /><em>Your table awaits.</em></h1>
      <p className={styles.successLead}>Your request has been saved as <strong>#{orderId}</strong>. Continue to WhatsApp so our team can confirm availability, delivery charge and timing before you pay.</p>
      <div className={styles.successItems}>{orderItems.map(item => <div key={`${item.product.id}-${item.variant.weight_grams}`}><span>{item.product.name} · {formatWeight(item.variant.weight_grams)} × {item.quantity}</span><strong>{money(item.variant.price * item.quantity)}</strong></div>)}</div>
      <div className={styles.successTotal}><span>Product total · delivery extra</span><strong>{money(orderTotals?.total ?? 0)}</strong></div>
      <button type="button" className={styles.submit} onClick={openWhatsApp}><MessageCircle size={19} /> Continue to WhatsApp <ArrowRight size={18} /></button>
      <Link href="/shop" className={styles.successLink}>Continue exploring spices</Link>
    </div>
  </main>;
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
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [recentlyCleared, setRecentlyCleared] = useState<CartItem[]>([]);
  const [clearedPromo, setClearedPromo] = useState<PromoCode | null>(null);

  const clearAllItems = () => {
    setRecentlyCleared([...items]);
    setClearedPromo(appliedPromoCode);
    clearCart();
    setPromoInput("");
    setPromoError("");
  };

  const undoClear = () => {
    useCart.setState({ items: recentlyCleared, appliedPromoCode: clearedPromo });
    setRecentlyCleared([]);
    setClearedPromo(null);
  };

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

    const orderCustomer = { ...customer, notes: [customer.notes?.trim(), includeGiftNote && giftMessage.trim() ? `Gift note: ${giftMessage.trim()}` : ""].filter(Boolean).join("\n") };
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
        notes: orderCustomer.notes,
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
        orderCustomer,
        generatedOrderId,
        currentItems,
        confirmedTotals,
      );

      setOrderId(generatedOrderId);
      setOrderData(orderCustomer);
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

  if (loading) return <div className={styles.page}><div className={styles.loading} role="status">Preparing your cart…</div></div>;
  if (submitted && orderData) return <OrderSuccess orderId={orderId} orderItems={lastOrderItems} orderTotals={lastOrderTotals} openWhatsApp={openWhatsApp} />;

  const packCount = items.reduce((count, item) => count + item.quantity, 0);
  return <div className={styles.page}>
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <Link href="/shop" className={styles.back}><ArrowLeft size={17} /> Back to spices</Link>
        <p className={styles.kicker}><Sparkles size={16} /> THE GOOD PART BEGINS HERE</p>
        <h1>Your bag, <em>beautifully seasoned.</em></h1>
        <p>One easy place to review your blends and tell us where to send them. We’ll confirm your order personally on WhatsApp.</p>
      </div>
      <div className={styles.heroArt} aria-hidden="true"><span className={styles.orbitOne} /><span className={styles.orbitTwo} /><span className={styles.sparkOne}>✦</span><span className={styles.sparkTwo}>✳</span><span className={styles.heroWord}>Q</span></div>
    </div>
    <div className={styles.container}>
      <div className={styles.journey} aria-label="How ordering works">
        <div><span>01</span><strong>Choose your spices</strong><Check size={15} /></div>
        <div><span>02</span><strong>Share your details</strong><span className={styles.journeyDash} /></div>
        <div><span>03</span><strong>Confirm on WhatsApp</strong><MessageCircle size={16} /></div>
      </div>
      {items.length === 0 ? <div className={styles.empty}>
        <div className={styles.emptyIcon}><ShoppingBag size={36} /></div>
        <p className={styles.kicker}>{recentlyCleared.length ? 'CART CLEARED' : 'READY WHEN YOU ARE'}</p>
        <h2>{recentlyCleared.length ? <>Your bag is<br />freshly cleared.</> : <>Your bag is waiting<br />for its first flavour.</>}</h2>
        <p>{recentlyCleared.length ? 'All items and the applied promo code were removed from this device.' : 'Explore the collection and add something delicious to get started.'}</p>
        {recentlyCleared.length > 0 && <button type="button" className={styles.undoClear} onClick={undoClear}>Undo clear cart</button>}
        <Link href="/shop" className={styles.primaryLink}>Explore the spices <ArrowRight size={18} /></Link>
      </div> : <form id="delivery-checkout-form" onSubmit={handleSubmit(onSubmit)} className={styles.layout}>
        <div className={styles.mainColumn}>
          <section className={styles.section} aria-labelledby="cart-heading">
            <div className={styles.sectionHead}><div><p className={styles.sectionIndex}>01 / YOUR SELECTION</p><h2 id="cart-heading">The good stuff</h2><p>{packCount} {packCount === 1 ? 'pack' : 'packs'} ready for your kitchen</p></div><button type="button" className={styles.clearTrigger} onClick={clearAllItems}><Trash2 size={16} /> Clear cart</button></div>
            <div className={styles.productList}>{items.map(item => <CartProductRow key={`${item.product.id}-${item.variant.weight_grams}`} item={item} updateQuantity={updateQty} removeProduct={removeItem} />)}</div>
            <Link href="/shop" className={styles.addMore}><Plus size={17} /> Add another flavour <ArrowRight size={16} /></Link>
          </section>
          <section className={styles.section} aria-labelledby="delivery-heading">
            <div className={styles.sectionHead}><div><p className={styles.sectionIndex}>02 / DELIVERY DETAILS</p><h2 id="delivery-heading">Where should it go?</h2><p>Just the essentials to prepare your order.</p></div><MapPin size={24} /></div>
            <div className={styles.formBody}>
              {!user && <p className={styles.signIn}>Already ordered with us? <Link href="/login">Sign in to fill your details</Link>. Or carry on as a guest.</p>}
              <div className={styles.fields}>
                <CheckoutInput id="customer_name" label="Full name" placeholder="Your full name" autoComplete="name" register={register} errors={errors} />
                <CheckoutInput id="customer_phone" label="Phone / WhatsApp" type="tel" placeholder="+91 98765 43210" autoComplete="tel" register={register} errors={errors} />
                <CheckoutInput id="customer_email" label="Email address" type="email" placeholder="you@email.com" autoComplete="email" register={register} errors={errors} />
                <div className={styles.field}><label htmlFor="customer_address">Complete delivery address</label><textarea id="customer_address" rows={3} autoComplete="street-address" placeholder="House number, street, landmark and area" aria-invalid={!!errors.customer_address} aria-describedby={errors.customer_address ? 'customer_address-error' : undefined} {...register('customer_address')} />{errors.customer_address && <p id="customer_address-error" role="alert" className={styles.error}>{errors.customer_address.message}</p>}</div>
                <CheckoutInput id="customer_city" label="City" placeholder="Your city" autoComplete="address-level2" register={register} errors={errors} />
                <CheckoutInput id="customer_pincode" label="Pincode" placeholder="6-digit pincode" autoComplete="postal-code" register={register} errors={errors} />
                <div className={styles.field}><label htmlFor="notes">Order notes <span>(optional)</span></label><textarea id="notes" rows={2} placeholder="Delivery instructions or anything we should know" {...register('notes')} /></div>
              </div>
              <div className={styles.giftBlock}><label className={styles.giftToggle}><input type="checkbox" checked={includeGiftNote} onChange={event => setIncludeGiftNote(event.target.checked)} /><Gift size={19} /><span><strong>Sending this as a gift?</strong><small>Add a personal note for our team to include with your request.</small></span></label>{includeGiftNote && <div className={styles.field}><label htmlFor="gift-message">Your gift note</label><textarea id="gift-message" rows={2} maxLength={240} value={giftMessage} onChange={event => setGiftMessage(event.target.value)} placeholder="Write a little something…" /><small>{giftMessage.length}/240 characters · gift arrangements confirmed on WhatsApp</small></div>}</div>
            </div>
          </section>
        </div>
        <aside className={styles.sidebar} aria-labelledby="summary-heading">
          <div className={styles.summary}>
            <div className={styles.summaryHead}><p className={styles.sectionIndex}>03 / THE FINISHING TOUCH</p><h2 id="summary-heading">Your order</h2><p>Review the numbers before you send.</p></div>
            <div className={styles.summaryBody}>
              <div className={styles.miniItems}>{items.map(item => <div key={`${item.product.id}-${item.variant.weight_grams}`}><span>{item.product.name} <small>{formatWeight(item.variant.weight_grams)} × {item.quantity}</small></span><strong>{money(item.variant.price * item.quantity)}</strong></div>)}</div>
              <div className={styles.promo}>{appliedPromoCode ? <div className={styles.applied}><span><Check size={16} /> {appliedPromoCode.code} applied</span><button type="button" onClick={handleRemovePromo}>Remove</button></div> : <><label htmlFor="promo-code">Have a promo code?</label><div className={styles.promoEntry}><input id="promo-code" value={promoInput} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void handleApplyPromo() } }} onChange={event => { setPromoInput(event.target.value); setPromoError('') }} placeholder="Enter your code" /><button type="button" disabled={applyingPromo} onClick={handleApplyPromo}>{applyingPromo ? 'Checking…' : 'Apply'}</button></div>{promoError && <p role="alert" className={styles.error}>{promoError}</p>}</>}</div>
              <div className={styles.totals}><div><span>Spices subtotal</span><strong>{money(currentTotals.subtotal)}</strong></div>{currentTotals.discount > 0 && <div className={styles.discount}><span>Discount</span><strong>−{money(currentTotals.discount)}</strong></div>}<div className={styles.totalLine}><span>Product total</span><strong>{money(currentTotals.total)}</strong></div><p>Delivery charge is quoted separately on WhatsApp before you confirm.</p></div>
              <button type="submit" disabled={isSubmitting} className={styles.submit}><MessageCircle size={19} /> {isSubmitting ? 'Sending your request…' : 'Send order request'} <ArrowRight size={18} /></button>
              <p className={styles.paymentNote}><ShieldCheck size={16} /> No payment is collected on this website.</p>
            </div>
          </div>
          <div className={styles.help}><span>NEED A HAND?</span><p>Questions about a blend or your order?</p><Link href="/contact">Talk to us <ArrowRight size={16} /></Link></div>
        </aside>
      </form>}
    </div>
    {items.length > 0 && <div className={styles.mobileBar}><div><span>Product total <small>· delivery extra</small></span><strong>{money(currentTotals.total)}</strong></div><button type="submit" form="delivery-checkout-form" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send request'} <ArrowRight size={17} /></button></div>}
  </div>;
}
