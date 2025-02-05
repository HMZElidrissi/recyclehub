import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './collection.reducer';

export const selectCollectionState =
  createFeatureSelector<CollectionState>('collection');

export const selectAllRequests = createSelector(
  selectCollectionState,
  (state) => state.requests,
);

export const selectLoading = createSelector(
  selectCollectionState,
  (state) => state.loading,
);

export const selectError = createSelector(
  selectCollectionState,
  (state) => state.error,
);
