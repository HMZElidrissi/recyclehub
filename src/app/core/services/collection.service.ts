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
import { Role } from '@core/models/user.interface';

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

    // Le collecteur ne peut visionner que la liste des demandes provenant de sa même ville
    if (currentUser.role === Role.COLLECTOR) {
      return this.http.get<CollectionRequest[]>(this.apiUrl).pipe(
        map((requests) =>
          requests.filter((request) => {
            return request.address.includes(currentUser.address);
          }),
        ),
        catchError((error) =>
          throwError(
            () => new Error(`Failed to fetch requests: ${error.message}`),
          ),
        ),
      );
    }

    return this.http
      .get<CollectionRequest[]>(`${this.apiUrl}?particularId=${currentUser.id}`)
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
      return throwError(() => new Error('Estimated Weight is 1000g minimum'));
    }

    if (request.estimatedWeight > 10000) {
      return throwError(() => new Error('Maximum weight is 10kg (10000g)'));
    }

    // Effectuer au maximum 3 demandes différentes simultanées non encore validées ou rejetées
    return this.getUserRequests().pipe(
      map((requests) => {
        const pendingReqs = requests.filter(
          (req) =>
            req.status === RequestStatus.PENDING ||
            req.status === RequestStatus.OCCUPIED ||
            req.status === RequestStatus.IN_PROGRESS,
        );

        if (pendingReqs.length >= 3) {
          throw new Error('You cannot make more than 3 pending requests');
        }
        return requests;
      }),
      map(() => ({
        ...request,
        id: crypto.randomUUID(),
        status: RequestStatus.PENDING,
        particularId: this.authService.getCurrentUser()?.id || '',
      })),
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
      return throwError(() => new Error('Estimated Weight is 1000g minimum'));
    }

    // If validating the request with actual weight
    if (updates.status === RequestStatus.VALIDATED && updates.actualWeight) {
      if (updates.actualWeight > 10000) {
        return throwError(() => new Error('Maximum weight is 10kg (10000g)'));
      }
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

  uploadImages(id: string, images: File[]): Observable<CollectionRequest> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    return this.http
      .post<CollectionRequest>(`${this.apiUrl}/${id}/images`, formData)
      .pipe(
        catchError((error) =>
          throwError(
            () => new Error(`Failed to upload images: ${error.message}`),
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
