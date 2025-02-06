import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CollectionRequest } from '@core/models/collection.interface';

export const CollectionActions = createActionGroup({
  source: 'Collection',
  events: {
    // Load requests
    'Load Requests': emptyProps(),
    'Load Requests Success': props<{ requests: CollectionRequest[] }>(),
    'Load Requests Failure': props<{ error: string }>(),

    // Create request
    'Create Request': props<{
      request: Omit<
        CollectionRequest,
        'id' | 'collectorId' | 'status' | 'particularId'
      >;
    }>(),
    'Create Request Success': props<{ request: CollectionRequest }>(),
    'Create Request Failure': props<{ error: string }>(),

    // Update request
    'Update Request': props<{
      id: string;
      changes: Partial<CollectionRequest>;
    }>(),
    'Update Request Success': props<{ request: CollectionRequest }>(),
    'Update Request Failure': props<{ error: string }>(),

    // Delete request
    'Delete Request': props<{ id: string }>(),
    'Delete Request Success': props<{ id: string }>(),
    'Delete Request Failure': props<{ error: string }>(),

    // Upload images
    'Upload Images': props<{ id: string; images: File[] }>(),
    'Upload Images Success': props<{ request: CollectionRequest }>(),
    'Upload Images Failure': props<{ error: string }>(),

    // Update user points
    'Update User Points': props<{ userId: string; points: number }>(),
    'Update User Points Success': props<{ userId: string; points: number }>(),
    'Update User Points Failure': props<{ error: string }>(),
  },
});
