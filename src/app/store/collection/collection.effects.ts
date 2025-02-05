import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap } from 'rxjs/operators';
import { CollectionService } from '@core/services/collection.service';
import { CollectionActions } from './collection.actions';

@Injectable({
  providedIn: 'root',
})
export class CollectionEffects {
  loadRequests$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectionActions.loadRequests),
      mergeMap(() =>
        this.collectionService.getUserRequests().pipe(
          map((requests) =>
            CollectionActions.loadRequestsSuccess({ requests }),
          ),
          catchError((error) =>
            of(CollectionActions.loadRequestsFailure({ error: error.message })),
          ),
        ),
      ),
    );
  });

  createRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectionActions.createRequest),
      exhaustMap(({ request }) =>
        this.collectionService.createRequest(request).pipe(
          map((newRequest) =>
            CollectionActions.createRequestSuccess({ request: newRequest }),
          ),
          catchError((error) =>
            of(
              CollectionActions.createRequestFailure({ error: error.message }),
            ),
          ),
        ),
      ),
    );
  });

  updateRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectionActions.updateRequest),
      exhaustMap(({ id, changes }) =>
        this.collectionService.updateRequest(id, changes).pipe(
          map((updatedRequest) =>
            CollectionActions.updateRequestSuccess({ request: updatedRequest }),
          ),
          catchError((error) =>
            of(
              CollectionActions.updateRequestFailure({ error: error.message }),
            ),
          ),
        ),
      ),
    );
  });

  deleteRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectionActions.deleteRequest),
      mergeMap(({ id }) =>
        this.collectionService.deleteRequest(id).pipe(
          map(() => CollectionActions.deleteRequestSuccess({ id })),
          catchError((error) =>
            of(
              CollectionActions.deleteRequestFailure({ error: error.message }),
            ),
          ),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private collectionService: CollectionService,
  ) {}
}
