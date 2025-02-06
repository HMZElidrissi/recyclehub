import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { collectionReducer } from '@store/collection/collection.reducer';
import { CollectionEffects } from '@store/collection/collection.effects';
import { PointsEffects } from '@store/points/points.effects';
import { pointsReducer } from '@store/points/points.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    provideStore({
      collection: collectionReducer,
      points: pointsReducer,
    }),
    provideEffects([CollectionEffects, PointsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
