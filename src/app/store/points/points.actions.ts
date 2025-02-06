import { createActionGroup, props } from '@ngrx/store';
import { CouponOption } from '@core/models/point.interface';
import { User } from '@core/models/user.interface';

export const PointsActions = createActionGroup({
  source: 'Points',
  events: {
    'Convert Points': props<{ option: CouponOption }>(),
    'Convert Points Success': props<{ user: User }>(),
    'Convert Points Failure': props<{ error: string }>(),
  },
});
