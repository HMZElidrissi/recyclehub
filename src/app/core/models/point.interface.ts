export interface CouponOption {
  points: number;
  value: number;
}

export const POINTS_PER_KG = {
  PLASTIC: 2,
  GLASS: 1,
  PAPER: 1,
  METAL: 5,
};

export const COUPON_OPTIONS: CouponOption[] = [
  { points: 100, value: 50 },
  { points: 200, value: 120 },
  { points: 500, value: 350 },
];
