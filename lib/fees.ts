// Shared order fee math, used by the cart drawer and checkout so both show the
// same numbers.

export const SHIPPING_FEE = 2500;

// Paystack NGN pricing: 1.5% + ₦100, where the flat fee is waived on
// transactions under ₦2,500 and the total charge is capped at ₦2,000.
const FEE_RATE = 0.015;
const FLAT_FEE = 100;
const FLAT_FEE_WAIVER_LIMIT = 2500;
const FEE_CAP = 2000;

/**
 * The Paystack charge to add on top of `amount` so we still net `amount` after
 * Paystack takes its cut. Adding 1.5% of `amount` directly would fall short —
 * Paystack charges on the grossed-up figure, so we solve for it instead.
 */
export function paystackFee(amount: number): number {
    if (amount <= 0) return 0;

    const flat = amount < FLAT_FEE_WAIVER_LIMIT ? 0 : FLAT_FEE;
    const grossed = (amount + flat) / (1 - FEE_RATE);
    const fee = Math.min(grossed - amount, FEE_CAP);

    // Round up to the kobo so rounding never leaves us short.
    return Math.ceil(fee * 100) / 100;
}

/** Full breakdown of what the customer pays for a given cart subtotal. */
export function orderTotals(subtotal: number, hasItems: boolean) {
    const shippingFee = hasItems ? SHIPPING_FEE : 0;
    const transactionFee = paystackFee(subtotal + shippingFee);
    return {
        subtotal,
        shippingFee,
        transactionFee,
        total: subtotal + shippingFee + transactionFee,
    };
}
