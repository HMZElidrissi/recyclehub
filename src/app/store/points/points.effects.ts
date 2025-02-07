import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { PointsService } from '@core/services/points.service';
import { PointsActions } from './points.actions';
import { AuthService } from '@core/services/auth.service';

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
            this.authService.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return PointsActions.convertPointsSuccess({ user });
          }),
          catchError((error) =>
            of(PointsActions.convertPointsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updateUserAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PointsActions.convertPointsSuccess),
        tap(({ user }) => {
          this.authService.currentUserSubject.next(user);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private pointsService: PointsService,
    private authService: AuthService,
  ) {}
}
