"use client";

import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  checkCouponAction,
  sendOtpAction,
  verifyOtpAction,
  verifyRedeemPaymentAction,
} from "./actions";
import { isRazorpayResult, loadRazorpay } from "@/lib/razorpay-client";
import type {
  RedeemCoupon,
  RedeemGrant,
  RedeemPlan,
  RedeemRazorpayOrder,
} from "@/types/redeem";

/**
 * The redeem flow is a plain step machine. The server decides everything
 * that matters (coupon validity, price, OTP, payment); this component only
 * collects input, shows the server's messages, and remembers where the
 * visitor is so a reload doesn't send them back to the start.
 */

type Step =
  | { kind: "code" }
  | { kind: "details"; coupon: RedeemCoupon; planId: number }
  | {
      kind: "otp";
      coupon: RedeemCoupon;
      plan: RedeemPlan;
      mobile: string;
      countryCode: string;
      token: string;
      /** Epoch ms after which "Resend" is offered. */
      resendAt: number;
      /** Epoch ms when the OTP stops being valid. */
      otpExpiresAt: number;
    }
  | {
      kind: "payment";
      token: string;
      plan: string;
      amount: number;
      razorpay: RedeemRazorpayOrder;
      mobileLabel: string;
    }
  | { kind: "processing"; message: string; mobileLabel: string }
  | { kind: "done"; grant: RedeemGrant };

// sessionStorage only: it is cleared when the tab closes and is never
// shared with other tabs or sent anywhere. The token must not go in
// localStorage or a URL.
const STORAGE_KEY = "lala-redeem";
const STORAGE_TTL_MS = 30 * 60_000;
const RESEND_DELAY_MS = 45_000;

function saveStep(step: Step) {
  try {
    if (step.kind === "code") sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), step }));
  } catch {
    // Private mode or blocked storage: the flow still works within the page.
  }
}

function loadStep(): Step | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; step?: Step };
    if (
      typeof parsed.savedAt !== "number" ||
      Date.now() - parsed.savedAt > STORAGE_TTL_MS ||
      !parsed.step ||
      typeof parsed.step.kind !== "string"
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.step;
  } catch {
    return null;
  }
}

function formatMobile(countryCode: string, mobile: string): string {
  if (countryCode === "+91" && mobile.length === 10) {
    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  }
  return `${countryCode} ${mobile}`;
}

function formatDate(value: string): string {
  const time = Date.parse(value.replace(" ", "T"));
  if (Number.isNaN(time)) return value;
  return new Date(time).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRupees(amount: number): string {
  return `₹${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

const inputClass =
  "w-full rounded-2xl border border-card-border bg-secondary text-text-dark px-4 py-3 text-base focus:border-[#FF7A2F] focus:outline-hidden transition-all placeholder-text-muted/60 disabled:opacity-60";
const primaryButton =
  "inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full bg-[#FF7A2F] hover:bg-[#E55A10] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const secondaryButton =
  "inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-secondary border border-card-border hover:border-orange-500/30 text-sm font-extrabold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-bold text-rose-600 bg-rose-500/5 border border-rose-500/20 rounded-2xl px-4 py-3">
      {message}
    </p>
  );
}

const STEP_LABELS = ["Code", "Plan & mobile", "Verify", "Done"];

function stepIndex(step: Step): number {
  switch (step.kind) {
    case "code":
      return 0;
    case "details":
      return 1;
    case "otp":
    case "payment":
    case "processing":
      return 2;
    case "done":
      return 3;
  }
}

function Progress({ step }: { step: Step }) {
  const current = stepIndex(step);
  return (
    <ol className="flex items-center justify-between gap-2 text-[11px] font-extrabold uppercase tracking-wider">
      {STEP_LABELS.map((label, index) => (
        <li key={label} className="flex items-center gap-2 min-w-0">
          <span
            className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs ${
              index < current
                ? "bg-emerald-500 text-white"
                : index === current
                  ? "bg-[#FF7A2F] text-white"
                  : "bg-card-border text-text-muted"
            }`}
            aria-hidden="true"
          >
            {index < current ? "✓" : index + 1}
          </span>
          <span className={`truncate ${index === current ? "text-text-dark" : "text-text-muted"}`}>
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function RedeemFlow() {
  const [step, setStepState] = useState<Step>({ kind: "code" });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const setStep = useCallback((next: Step) => {
    setStepState(next);
    setError("");
    saveStep(next);
  }, []);

  // Restore after a reload. Reading storage is a browser-only side effect,
  // so it can't happen during the server render.
  useEffect(() => {
    const saved = loadStep();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setStepState(saved);
  }, []);

  const restart = useCallback(() => setStep({ kind: "code" }), [setStep]);

  return (
    <div className="bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
      <Progress step={step} />

      {step.kind === "code" && (
        <CodeStep
          pending={pending}
          error={error}
          onSubmit={(coupon) =>
            startTransition(async () => {
              const result = await checkCouponAction({ coupon });
              if (!result.ok) return setError(result.message);
              setStep({
                kind: "details",
                coupon: result.data,
                planId: result.data.plans.length === 1 ? result.data.plans[0].planId : 0,
              });
            })
          }
        />
      )}

      {step.kind === "details" && (
        <DetailsStep
          step={step}
          pending={pending}
          error={error}
          onBack={restart}
          onChoosePlan={(planId) => setStep({ ...step, planId })}
          onSubmit={(mobile, countryCode) =>
            startTransition(async () => {
              const plan = step.coupon.plans.find((p) => p.planId === step.planId);
              if (!plan) return setError("Choose a plan first.");
              const result = await sendOtpAction({
                coupon: step.coupon.coupon,
                planId: plan.planId,
                mobile,
                countryCode,
              });
              if (!result.ok) return setError(result.message);
              const now = Date.now();
              setStep({
                kind: "otp",
                coupon: step.coupon,
                plan,
                mobile,
                countryCode,
                token: result.data.token,
                resendAt: now + RESEND_DELAY_MS,
                otpExpiresAt: now + result.data.otpExpiresIn * 1000,
              });
            })
          }
        />
      )}

      {step.kind === "otp" && (
        // Keyed on the token so a resent code starts with an empty input.
        <OtpStep
          key={step.token}
          step={step}
          pending={pending}
          error={error}
          onChangeNumber={() =>
            setStep({ kind: "details", coupon: step.coupon, planId: step.plan.planId })
          }
          onResend={() =>
            startTransition(async () => {
              const result = await sendOtpAction({
                coupon: step.coupon.coupon,
                planId: step.plan.planId,
                mobile: step.mobile,
                countryCode: step.countryCode,
              });
              if (!result.ok) return setError(result.message);
              const now = Date.now();
              // The old token stops working; switch to the new one.
              setStep({
                ...step,
                token: result.data.token,
                resendAt: now + RESEND_DELAY_MS,
                otpExpiresAt: now + result.data.otpExpiresIn * 1000,
              });
            })
          }
          onSubmit={(otp) =>
            startTransition(async () => {
              const result = await verifyOtpAction({ token: step.token, otp });
              if (!result.ok) return setError(result.message);
              const mobileLabel = formatMobile(step.countryCode, step.mobile);
              const outcome = result.data;
              if (outcome.status === "granted") {
                setStep({
                  kind: "done",
                  grant: { ...outcome.grant, mobile: outcome.grant.mobile || mobileLabel },
                });
              } else if (outcome.status === "payment_required") {
                setStep({
                  kind: "payment",
                  token: outcome.token,
                  plan: outcome.plan || step.plan.title,
                  amount: outcome.amount,
                  razorpay: outcome.razorpay,
                  mobileLabel,
                });
              } else {
                setStep({ kind: "processing", message: outcome.message, mobileLabel });
              }
            })
          }
        />
      )}

      {step.kind === "payment" && (
        <PaymentStep
          step={step}
          onGranted={(grant) =>
            setStep({ kind: "done", grant: { ...grant, mobile: grant.mobile || step.mobileLabel } })
          }
          onProcessing={(message) =>
            setStep({ kind: "processing", message, mobileLabel: step.mobileLabel })
          }
        />
      )}

      {step.kind === "processing" && (
        <div className="text-center space-y-4 py-4">
          <span className="text-5xl block">⏳</span>
          <h2 className="font-heading font-extrabold text-2xl">We&apos;re confirming your payment</h2>
          <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
            {step.message} Please don&apos;t pay again. Once it clears, the plan will be on the
            app account for <strong className="text-text-dark">{step.mobileLabel}</strong>.
          </p>
          <a href="tel:+918590166898" className={secondaryButton}>
            📞 Call us
          </a>
        </div>
      )}

      {step.kind === "done" && <DoneStep grant={step.grant} onRestart={restart} />}
    </div>
  );
}

function CodeStep({
  pending,
  error,
  onSubmit,
}: {
  pending: boolean;
  error: string;
  onSubmit: (coupon: string) => void;
}) {
  const [coupon, setCoupon] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pending) onSubmit(coupon.trim());
      }}
    >
      <div className="space-y-1.5">
        <label htmlFor="coupon" className="block text-xs font-extrabold uppercase tracking-wider text-text-muted">
          Coupon code
        </label>
        <input
          id="coupon"
          name="coupon"
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="e.g. LALA50"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={64}
          required
          disabled={pending}
          className={`${inputClass} font-heading font-extrabold tracking-widest uppercase`}
        />
      </div>
      <ErrorNote message={error} />
      <button type="submit" disabled={pending || coupon.trim().length < 3} className={primaryButton}>
        {pending ? "Checking…" : "Check code →"}
      </button>
    </form>
  );
}

function DetailsStep({
  step,
  pending,
  error,
  onBack,
  onChoosePlan,
  onSubmit,
}: {
  step: Extract<Step, { kind: "details" }>;
  pending: boolean;
  error: string;
  onBack: () => void;
  onChoosePlan: (planId: number) => void;
  onSubmit: (mobile: string, countryCode: string) => void;
}) {
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const { coupon } = step;
  const chosen = coupon.plans.find((p) => p.planId === step.planId) ?? null;
  const isIndia = countryCode === "+91";
  const mobileOk = isIndia ? /^[6-9]\d{9}$/.test(mobile) : mobile.length >= 6;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pending && chosen) onSubmit(mobile, countryCode);
      }}
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <p>
          Coupon{" "}
          <span className="font-heading font-extrabold tracking-widest text-[#FF7A2F]">
            {coupon.coupon}
          </span>{" "}
          <span className="text-emerald-600 font-bold">✓ valid</span>
        </p>
        <button type="button" onClick={onBack} disabled={pending} className="text-text-muted hover:text-[#FF7A2F] font-bold">
          Change code
        </button>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-xs font-extrabold uppercase tracking-wider text-text-muted mb-2">
          {coupon.plans.length > 1 ? "Choose your plan" : "Your plan"}
        </legend>
        {coupon.plans.map((plan) => {
          const selected = plan.planId === step.planId;
          const bonusDays = plan.extraDays || coupon.extraDays;
          return (
            <label
              key={plan.planId}
              className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${
                selected
                  ? "border-[#FF7A2F] bg-orange-500/5 shadow-sm"
                  : "border-card-border hover:border-orange-500/30"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={plan.planId}
                checked={selected}
                onChange={() => onChoosePlan(plan.planId)}
                disabled={pending}
                className="accent-[#FF7A2F] w-4 h-4"
              />
              <span className="grow min-w-0">
                <span className="font-heading font-extrabold block">{plan.title}</span>
                <span className="text-xs text-text-muted">
                  {plan.durationDays > 0 && `${plan.durationDays} days`}
                  {bonusDays > 0 && ` + ${bonusDays} bonus days`}
                </span>
              </span>
              <span className="text-right font-heading shrink-0">
                {plan.payable === 0 ? (
                  <span className="text-emerald-600 font-extrabold text-lg">FREE</span>
                ) : (
                  <span className="text-[#FF7A2F] font-extrabold text-lg">
                    {formatRupees(plan.payable)}
                  </span>
                )}
                {plan.price > plan.payable && (
                  <span className="block text-xs text-text-muted line-through">
                    {formatRupees(plan.price)}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="mobile" className="block text-xs font-extrabold uppercase tracking-wider text-text-muted">
          Mobile number
        </label>
        <div className="flex gap-2">
          <input
            id="country-code"
            name="country_code"
            type="text"
            inputMode="tel"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.replace(/[^\d+]/g, "").slice(0, 5))}
            aria-label="Country code"
            maxLength={5}
            disabled={pending}
            className={`${inputClass} w-24 shrink-0 text-center`}
          />
          <input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 15))}
            placeholder={isIndia ? "10-digit mobile number" : "Mobile number"}
            required
            disabled={pending}
            className={inputClass}
          />
        </div>
        <p className="text-[11px] text-text-muted">
          The plan is activated on the app account for this number. You&apos;ll get a
          one-time password by {isIndia ? "SMS" : "WhatsApp"}.
        </p>
      </div>

      <ErrorNote message={error} />
      <button type="submit" disabled={pending || !chosen || !mobileOk} className={primaryButton}>
        {pending ? "Sending code…" : "Send one-time password →"}
      </button>
    </form>
  );
}

function OtpStep({
  step,
  pending,
  error,
  onChangeNumber,
  onResend,
  onSubmit,
}: {
  step: Extract<Step, { kind: "otp" }>;
  pending: boolean;
  error: string;
  onChangeNumber: () => void;
  onResend: () => void;
  onSubmit: (otp: string) => void;
}) {
  const [otp, setOtp] = useState("");
  const [now, setNow] = useState(() => Date.now());

  // Drives the resend countdown and the expiry notice.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const resendIn = Math.max(0, Math.ceil((step.resendAt - now) / 1000));
  const expired = now >= step.otpExpiresAt;
  const payable = step.plan.payable;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pending) onSubmit(otp);
      }}
    >
      <div className="space-y-1 text-sm">
        <p>
          We sent a one-time password to{" "}
          <strong>{formatMobile(step.countryCode, step.mobile)}</strong>.
        </p>
        <p className="text-text-muted">
          {step.plan.title} ·{" "}
          {payable === 0 ? (
            <span className="text-emerald-600 font-bold">FREE with this coupon</span>
          ) : (
            <>
              <span className="font-bold text-text-dark">{formatRupees(payable)}</span> to pay
              after verification
            </>
          )}
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="otp" className="block text-xs font-extrabold uppercase tracking-wider text-text-muted">
          One-time password
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{4,6}"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
          required
          disabled={pending}
          className={`${inputClass} font-heading font-extrabold tracking-[0.5em] text-center text-2xl`}
        />
        {expired ? (
          <p className="text-[11px] font-bold text-amber-600">
            That code has expired. Request a new one below.
          </p>
        ) : (
          <p className="text-[11px] text-text-muted">Valid for 10 minutes.</p>
        )}
      </div>

      <ErrorNote message={error} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending || otp.length < 4 || expired} className={primaryButton}>
          {pending ? "Verifying…" : "Verify →"}
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={pending || resendIn > 0}
          className={secondaryButton}
        >
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
        </button>
        <button
          type="button"
          onClick={onChangeNumber}
          disabled={pending}
          className="text-sm text-text-muted hover:text-[#FF7A2F] font-bold"
        >
          Change number
        </button>
      </div>
    </form>
  );
}

type PayState =
  | { kind: "opening" }
  | { kind: "verifying" }
  | { kind: "idle"; message: string }
  | { kind: "unconfirmed"; message: string };

function PaymentStep({
  step,
  onGranted,
  onProcessing,
}: {
  step: Extract<Step, { kind: "payment" }>;
  onGranted: (grant: RedeemGrant) => void;
  onProcessing: (message: string) => void;
}) {
  const [payState, setPayState] = useState<PayState>({ kind: "opening" });
  // Guards against Razorpay calling `handler` twice for one payment.
  const verifyingRef = useRef(false);

  const verify = useCallback(
    async (response: unknown) => {
      if (verifyingRef.current) return;
      if (!isRazorpayResult(response)) {
        setPayState({
          kind: "unconfirmed",
          message: "We couldn't read the payment receipt. If you were charged, please don't pay again — contact us.",
        });
        return;
      }
      verifyingRef.current = true;
      setPayState({ kind: "verifying" });

      const result = await verifyRedeemPaymentAction({ token: step.token, payment: response });
      verifyingRef.current = false;

      if (!result.ok) return setPayState({ kind: "unconfirmed", message: result.message });
      if (result.data.status === "granted") return onGranted(result.data.grant);
      if (result.data.status === "processing") return onProcessing(result.data.message);
      // payment_required again would mean the server didn't accept this
      // receipt as settling the order; treat it like an unconfirmed payment.
      setPayState({
        kind: "unconfirmed",
        message: "We couldn't confirm your payment automatically. If you were charged, please don't pay again — contact us.",
      });
    },
    [step.token, onGranted, onProcessing]
  );

  // Only changes state after an await, so the mount effect below can call
  // it without a synchronous setState.
  const pay = useCallback(async () => {
    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) {
      setPayState({
        kind: "idle",
        message: "We couldn't open the payment window. Check your connection and try again.",
      });
      return;
    }

    // Every value here came from the server for this redemption; the amount
    // is locked to the Razorpay order and is only shown, never decided, here.
    const checkout = new window.Razorpay({
      key: step.razorpay.key,
      order_id: step.razorpay.orderId,
      amount: step.razorpay.amount,
      currency: step.razorpay.currency,
      name: "LALA Stories",
      description: step.plan,
      prefill: step.razorpay.prefillContact ? { contact: step.razorpay.prefillContact } : undefined,
      theme: { color: "#FF7A2F" },
      handler: (response) => {
        void verify(response);
      },
      modal: {
        ondismiss: () =>
          setPayState((current) =>
            current.kind === "verifying"
              ? current
              : { kind: "idle", message: "Payment was cancelled. Nothing was charged — you can try again." }
          ),
      },
    });
    checkout.on("payment.failed", () => {
      setPayState({ kind: "idle", message: "That payment didn't go through. Please try again." });
    });
    checkout.open();
  }, [step.razorpay, step.plan, verify]);

  // Open checkout as soon as the OTP is verified instead of asking for a
  // second click. Mount only: re-running would reopen the modal.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void pay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (payState.kind === "unconfirmed") {
    return (
      <div className="text-center space-y-4 py-4">
        <span className="text-5xl block">⏳</span>
        <h2 className="font-heading font-extrabold text-2xl">We&apos;re checking your payment</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">{payState.message}</p>
        <a href="tel:+918590166898" className={secondaryButton}>
          📞 Call us
        </a>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 py-4">
      <span className="text-5xl block">🔒</span>
      <h2 className="font-heading font-extrabold text-2xl">
        {payState.kind === "verifying"
          ? "Confirming your payment…"
          : payState.kind === "opening"
            ? "Opening secure payment…"
            : "Payment not completed"}
      </h2>
      <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
        {payState.kind === "idle" ? payState.message : "Please don't close this page."}
      </p>
      <p className="font-heading text-sm font-extrabold">
        {step.plan} · <span className="text-[#FF7A2F]">{formatRupees(step.amount)}</span>
      </p>
      {payState.kind !== "verifying" && (
        <button
          type="button"
          onClick={() => {
            setPayState({ kind: "opening" });
            void pay();
          }}
          disabled={payState.kind === "opening"}
          className={primaryButton}
        >
          {payState.kind === "opening" ? "Opening payment…" : "Try again"}
        </button>
      )}
    </div>
  );
}

function DoneStep({ grant, onRestart }: { grant: RedeemGrant; onRestart: () => void }) {
  return (
    <div className="text-center space-y-5 py-4">
      <span className="text-5xl block">🎉</span>
      <h2 className="font-heading font-extrabold text-2xl md:text-3xl">Plan activated!</h2>
      <p className="text-base leading-relaxed max-w-md mx-auto">
        Open the LALA Stories app and log in with{" "}
        <strong className="text-[#FF7A2F] whitespace-nowrap">{grant.mobile}</strong>.
      </p>
      <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
        The plan is on the account for this mobile number. If you usually sign in with
        Google, it won&apos;t show there — use the mobile number instead.
      </p>
      <dl className="inline-grid grid-cols-[auto_auto] gap-x-6 gap-y-1.5 text-sm text-left bg-secondary border border-card-border rounded-2xl px-6 py-4">
        {grant.plan && (
          <>
            <dt className="text-text-muted font-bold">Plan</dt>
            <dd className="font-heading font-extrabold">{grant.plan}</dd>
          </>
        )}
        {grant.startDate && (
          <>
            <dt className="text-text-muted font-bold">Starts</dt>
            <dd className="font-heading font-extrabold">{formatDate(grant.startDate)}</dd>
          </>
        )}
        {grant.endDate && (
          <>
            <dt className="text-text-muted font-bold">Ends</dt>
            <dd className="font-heading font-extrabold">{formatDate(grant.endDate)}</dd>
          </>
        )}
      </dl>
      <div>
        <button type="button" onClick={onRestart} className={secondaryButton}>
          Redeem another code
        </button>
      </div>
    </div>
  );
}
