const whole = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const oneDp = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** ₦1,284,500 */
export const naira = (value: number) => `₦${whole.format(Math.round(value))}`;

/** ₦1,284,500.00 */
export const nairaExact = (value: number) => `₦${cents.format(value)}`;

/** 1,842.6 */
export const gb = (value: number) => oneDp.format(value);

/** 1,842 */
export const int = (value: number) => whole.format(value);
