"use client";

import React, { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/CartStore";
import { placeOrderAction } from "@/app/shop/actions";
import { EMPTY_ORDER_STATE } from "@/types/order";
import type { OrderFieldErrors } from "@/types/order";
import type { ShopProduct } from "@/types/shop";

interface CheckoutFormProps {
  products: ShopProduct[];
}

/** Why a basket line can't be ordered online — mirrors the server's rules. */
function lineProblem(product: ShopProduct, qty: number): string | null {
  if (!product.inStock) return "Out of stock";
  if (product.hasVariants) return "Needs an option choice — order by phone";
  if (product.includesSubscription) return "Needs phone verification — order by phone";
  if (product.availableQty > 0 && qty > product.availableQty)
    return `Only ${product.availableQty} available`;
  return null;
}

function Field({
  label,
  name,
  errors,
  required,
  children,
  hint,
}: {
  label: string;
  name: keyof OrderFieldErrors;
  errors: OrderFieldErrors;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  const error = errors[name];
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-extrabold uppercase tracking-wider text-text-muted">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-text-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="text-[11px] font-bold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-card-border bg-secondary text-text-dark px-4 py-2.5 text-sm focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/60";

const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  email: "",
};

type AddressFields = typeof EMPTY_ADDRESS;

type PincodeStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; label: string; areas: string[] }
  | { kind: "missing" };

export default function CheckoutForm({ products }: CheckoutFormProps) {
  const { lines, ready, setQty, removeItem, clear } = useCart();
  const [state, formAction, pending] = useActionState(placeOrderAction, EMPTY_ORDER_STATE);

  // Controlled so a rejected submission doesn't wipe the address: React
  // resets uncontrolled fields once a form action settles.
  const [address, setAddress] = useState<AddressFields>(EMPTY_ADDRESS);
  const [pincodeStatus, setPincodeStatus] = useState<PincodeStatus>({ kind: "idle" });
  const lookupRef = useRef<AbortController | null>(null);

  const setField = (key: keyof AddressFields) => (value: string) =>
    setAddress((prev) => ({ ...prev, [key]: value }));

  /**
   * Filling in a full PIN looks up its district and state, so the customer
   * doesn't type what the PIN already tells us. Both stay editable.
   */
  function handlePincodeChange(value: string) {
    setAddress((prev) => ({ ...prev, pincode: value }));

    const pin = value.replace(/\D/g, "");
    lookupRef.current?.abort();
    if (pin.length !== 6) {
      setPincodeStatus({ kind: "idle" });
      return;
    }

    const controller = new AbortController();
    lookupRef.current = controller;
    setPincodeStatus({ kind: "loading" });

    fetch(`/api/pincode/${pin}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data?.found && typeof data.state === "string") {
          const areas: string[] = Array.isArray(data.areas) ? data.areas : [];
          setAddress((prev) => ({
            ...prev,
            city: data.district || prev.city,
            state: data.state,
          }));
          setPincodeStatus({
            kind: "found",
            label: `${data.district}, ${data.state}`,
            areas,
          });
        } else {
          setPincodeStatus({ kind: "missing" });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setPincodeStatus({ kind: "missing" });
      });
  }

  // Drop any in-flight lookup when the form goes away.
  useEffect(() => () => lookupRef.current?.abort(), []);

  const catalog = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const basket = useMemo(
    () =>
      lines.map((line) => ({
        line,
        product: catalog.get(line.productId) ?? null,
      })),
    [lines, catalog]
  );

  const subtotal = basket.reduce(
    (sum, entry) => sum + (entry.product ? entry.product.price * entry.line.qty : 0),
    0
  );

  const hasProblem = basket.some(
    (entry) => !entry.product || lineProblem(entry.product, entry.line.qty) !== null
  );

  // The order is placed; the basket has served its purpose.
  useEffect(() => {
    if (state.status === "success") clear();
  }, [state.status, clear]);

  if (state.status === "success") {
    return (
      <div className="bg-card-bg border border-emerald-500/30 rounded-3xl p-10 text-center space-y-4">
        <span className="text-5xl block">🎉</span>
        <h2 className="font-heading font-extrabold text-2xl">Order placed!</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
          {state.message}
        </p>
        {state.order?.reference && (
          <p className="font-heading text-sm font-extrabold">
            Reference:{" "}
            <span className="text-[#FF7A2F]">{state.order.reference}</span>
          </p>
        )}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md transition-all"
        >
          Continue shopping →
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="bg-card-bg border border-card-border rounded-3xl p-10 text-center text-text-muted text-sm">
        Loading your basket…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="text-center py-20 bg-card-bg border border-card-border rounded-3xl">
        <span className="text-5xl block">🛒</span>
        <h2 className="font-heading font-extrabold text-2xl mt-4">Your basket is empty</h2>
        <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">
          Browse our books, toys and combos to get started.
        </p>
        <Link
          href="/shop"
          className="inline-flex mt-6 items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md transition-all"
        >
          Browse the shop →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* The server re-reads every product by id; this only says what and how many. */}
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(lines.map((l) => ({ productId: l.productId, qty: l.qty })))}
      />

      {/* Basket lines */}
      <section className="bg-card-bg border border-card-border rounded-3xl divide-y divide-card-border/60">
        {basket.map(({ line, product }) => {
          const problem = product ? lineProblem(product, line.qty) : "No longer available";
          return (
            <div key={line.productId} className="p-5 flex gap-4 items-center">
              <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-card-border">
                {product?.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🧸</div>
                )}
              </div>

              <div className="grow min-w-0 space-y-1">
                <h3 className="font-heading font-extrabold leading-tight line-clamp-2">
                  {product?.title ?? `Product #${line.productId}`}
                </h3>
                {product && (
                  <p className="text-sm text-text-muted">
                    ₹{product.price}
                    {product.mrp && (
                      <span className="ml-2 line-through opacity-70">₹{product.mrp}</span>
                    )}
                  </p>
                )}
                {problem && (
                  <p className="text-[11px] font-bold text-rose-600">⚠️ {problem}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1 border border-card-border rounded-full bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => setQty(line.productId, line.qty - 1)}
                    aria-label={`Decrease quantity of ${product?.title ?? "item"}`}
                    className="w-8 h-8 rounded-full font-extrabold hover:bg-card-bg transition-all"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold tabular-nums">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(line.productId, line.qty + 1)}
                    disabled={line.qty >= 99}
                    aria-label={`Increase quantity of ${product?.title ?? "item"}`}
                    className="w-8 h-8 rounded-full font-extrabold hover:bg-card-bg disabled:opacity-40 transition-all"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.productId)}
                  className="text-[11px] font-bold text-text-muted hover:text-rose-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <div className="p-5 flex items-center justify-between">
          <span className="font-heading font-extrabold">Subtotal</span>
          <span className="font-heading text-2xl font-extrabold text-[#FF7A2F]">
            ₹{subtotal}
          </span>
        </div>
      </section>

      {/* Delivery address */}
      <section className="bg-card-bg border border-card-border rounded-3xl p-6 space-y-5">
        <h2 className="font-heading font-extrabold text-lg">Delivery details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full name" name="name" errors={state.fieldErrors} required>
            <input
              id="name"
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              value={address.name}
              onChange={(e) => setField("name")(e.target.value)}
              aria-invalid={Boolean(state.fieldErrors.name)}
              className={inputClass}
              placeholder="Who should we deliver to?"
            />
          </Field>

          <Field
            label="Mobile number"
            name="phone"
            errors={state.fieldErrors}
            required
            hint="10 digits. We use this to confirm and track your order."
          >
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-2xl border border-card-border bg-secondary text-sm font-bold text-text-muted">
                +91
              </span>
              <input
                id="phone"
                name="phone"
                required
                inputMode="numeric"
                maxLength={15}
                autoComplete="tel-national"
                value={address.phone}
                onChange={(e) => setField("phone")(e.target.value)}
                aria-invalid={Boolean(state.fieldErrors.phone)}
                className={inputClass}
                placeholder="9876543210"
              />
            </div>
          </Field>
        </div>

        <Field label="Address line 1" name="line1" errors={state.fieldErrors} required>
          <input
            id="line1"
            name="line1"
            required
            maxLength={255}
            autoComplete="address-line1"
            value={address.line1}
            onChange={(e) => setField("line1")(e.target.value)}
            aria-invalid={Boolean(state.fieldErrors.line1)}
            className={inputClass}
            placeholder="House / flat, street"
          />
        </Field>

        <Field label="Address line 2" name="line2" errors={state.fieldErrors}>
          <input
            id="line2"
            name="line2"
            maxLength={255}
            autoComplete="address-line2"
            value={address.line2}
            onChange={(e) => setField("line2")(e.target.value)}
            className={inputClass}
            placeholder="Landmark, area (optional)"
          />
        </Field>

        {/* PIN first: it fills in the two fields after it. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field
            label="PIN code"
            name="pincode"
            errors={state.fieldErrors}
            required
            hint="6 digits — we'll fill in your district and state."
          >
            <input
              id="pincode"
              name="pincode"
              required
              inputMode="numeric"
              maxLength={10}
              autoComplete="postal-code"
              value={address.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              aria-invalid={Boolean(state.fieldErrors.pincode)}
              aria-describedby="pincode-status"
              className={inputClass}
              placeholder="682001"
            />
          </Field>

          <Field label="City / District" name="city" errors={state.fieldErrors} required>
            <input
              id="city"
              name="city"
              required
              maxLength={100}
              autoComplete="address-level2"
              value={address.city}
              onChange={(e) => setField("city")(e.target.value)}
              aria-invalid={Boolean(state.fieldErrors.city)}
              className={inputClass}
            />
          </Field>

          <Field label="State" name="state" errors={state.fieldErrors} required>
            <input
              id="state"
              name="state"
              required
              maxLength={100}
              autoComplete="address-level1"
              value={address.state}
              onChange={(e) => setField("state")(e.target.value)}
              aria-invalid={Boolean(state.fieldErrors.state)}
              className={inputClass}
            />
          </Field>
        </div>

        <p id="pincode-status" aria-live="polite" className="text-[11px] -mt-2">
          {pincodeStatus.kind === "loading" && (
            <span className="text-text-muted">Looking up PIN code…</span>
          )}
          {pincodeStatus.kind === "found" && (
            <span className="font-bold text-emerald-600">
              ✓ {pincodeStatus.label}
              {pincodeStatus.areas.length > 0 && (
                <span className="font-normal text-text-muted">
                  {" "}
                  · {pincodeStatus.areas.slice(0, 4).join(", ")}
                </span>
              )}
            </span>
          )}
          {pincodeStatus.kind === "missing" && (
            <span className="font-bold text-amber-600">
              We couldn&apos;t look that PIN code up — please type your district
              and state.
            </span>
          )}
        </p>

        <Field
          label="Email"
          name="email"
          errors={state.fieldErrors}
          hint="Optional, but it's the only way we can send your confirmation and tracking link."
        >
          <input
            id="email"
            name="email"
            type="email"
            maxLength={160}
            autoComplete="email"
            value={address.email}
            onChange={(e) => setField("email")(e.target.value)}
            aria-invalid={Boolean(state.fieldErrors.email)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>
      </section>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          aria-live="polite"
          className="text-sm font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={pending || hasProblem}
          className="inline-flex items-center justify-center gap-1.5 px-8 py-4 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Placing your order…" : "Place order"}
        </button>
        <p className="text-xs text-text-muted">
          No payment is taken online — the shop will contact you to confirm your
          order.
        </p>
      </div>
    </form>
  );
}
