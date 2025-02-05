import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CollectionRequest } from '@core/models/collection.interface';

export const CollectionActions = createActionGroup({
  source: 'Collection',
  events: {
    'Load Requests': emptyProps(),
    'Load Requests Success': props<{ requests: CollectionRequest[] }>(),
    'Load Requests Failure': props<{ error: string }>(),
    'Create Request': props<{
      request: Omit<
        CollectionRequest,
        'id' | 'collectorId' | 'status' | 'particularId'
      >;
    }>(),
    'Create Request Success': props<{ request: CollectionRequest }>(),
    'Create Request Failure': props<{ error: string }>(),
    'Update Request': props<{
      id: string;
      changes: Partial<CollectionRequest>;
    }>(),
    'Update Request Success': props<{ request: CollectionRequest }>(),
    'Update Request Failure': props<{ error: string }>(),
    'Delete Request': props<{ id: string }>(),
    'Delete Request Success': props<{ id: string }>(),
    'Delete Request Failure': props<{ error: string }>(),
  },
});
