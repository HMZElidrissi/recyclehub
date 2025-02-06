import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PointsState } from './points.reducer';

export const selectPointsState = createFeatureSelector<PointsState>('points');

export const selectPointsError = createSelector(
  selectPointsState,
  (state: PointsState) => state.error,
);

export const selectPointsLoading = createSelector(
  selectPointsState,
  (state: PointsState) => state.loading,
);
