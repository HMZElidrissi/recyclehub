import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import {
  CollectionRequest,
  RequestStatus,
} from '@core/models/collection.interface';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = `${environment.apiUrl}/collection-requests`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getUserRequests(): Observable<CollectionRequest[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http
      .get<CollectionRequest[]>(`${this.apiUrl}?userId=${currentUser.id}`)
      .pipe(
        catchError((error) =>
          throwError(
            () => new Error(`Failed to fetch requests: ${error.message}`),
          ),
        ),
      );
  }

  createRequest(
    request: Omit<
      CollectionRequest,
      'id' | 'collectorId' | 'status' | 'particularId'
    >,
  ): Observable<CollectionRequest> {
    // Poids estimé (minimum 1000g obligatoire)
    if (request.estimatedWeight < 1000) {
      throwError(() => new Error('Estimated Weight is 1000g minimum'));
    }

    // Effectuer au maximum 3 demandes différentes simultanées non encore validées ou rejetées
    return this.getUserRequests().pipe(
      map((requests) => {
        const pendingReqs = requests.filter(
          (req) => (req.status = RequestStatus.PENDING),
        );
        if (pendingReqs.length >= 3) {
          throwError(
            () => new Error('You cannot make more then 3 pending requests'),
          );
        }
        return requests;
      }),
      map(() => {
        const newReq: CollectionRequest = {
          ...request,
          id: crypto.randomUUID(),
          status: RequestStatus.PENDING,
          particularId: this.authService.getCurrentUser()?.id || '',
        };
        return newReq;
      }),
      switchMap((newReq) =>
        this.http.post<CollectionRequest>(this.apiUrl, newReq),
      ),
    );
  }

  updateRequest(
    id: string,
    updates: Partial<CollectionRequest>,
  ): Observable<CollectionRequest> {
    // Poids estimé (minimum 1000g obligatoire)
    if (updates.estimatedWeight && updates.estimatedWeight < 1000) {
      throwError(() => new Error('Estimated Weight is 1000g minimum'));
    }

    return this.http
      .patch<CollectionRequest>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        catchError((error) =>
          throwError(
            () => new Error(`Failed to update request: ${error.message}`),
          ),
        ),
      );
  }

  deleteRequest(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) =>
          throwError(
            () => new Error(`Failed to delete request: ${error.message}`),
          ),
        ),
      );
  }
}
