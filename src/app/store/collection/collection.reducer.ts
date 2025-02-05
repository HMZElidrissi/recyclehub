import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '@core/models/collection.interface';
import { CollectionActions } from './collection.actions';

export interface CollectionState {
  requests: CollectionRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  requests: [],
  loading: false,
  error: null,
};

export const collectionReducer = createReducer(
  initialState,
  on(CollectionActions.loadRequests, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionActions.loadRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false,
  })),
  on(CollectionActions.loadRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CollectionActions.createRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionActions.createRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
    loading: false,
  })),
  on(CollectionActions.updateRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map((r) => (r.id === request.id ? request : r)),
    loading: false,
  })),
  on(CollectionActions.deleteRequestSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter((r) => r.id !== id),
    loading: false,
  })),
);
