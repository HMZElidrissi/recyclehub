import { createReducer, on } from '@ngrx/store';
import { PointsActions } from './points.actions';

export interface PointsState {
  loading: boolean;
  error: string | null;
}

export const initialState: PointsState = {
  loading: false,
  error: null,
};

export const pointsReducer = createReducer(
  initialState,
  on(PointsActions.convertPoints, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PointsActions.convertPointsSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(PointsActions.convertPointsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
