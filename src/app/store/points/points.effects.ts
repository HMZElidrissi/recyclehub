import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PointsService } from '@core/services/points.service';
import { PointsActions } from '@store/points/points.actions';

@Injectable({
  providedIn: 'root',
})
export class PointsEffects {
  convertPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsActions.convertPoints),
      mergeMap(({ option }) =>
        this.pointsService.convertPointsToCoupon(option).pipe(
          map((user) => {
            return PointsActions.convertPointsSuccess({ user });
          }),
          catchError((error) =>
            of(PointsActions.convertPointsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private pointsService: PointsService,
  ) {}
}
