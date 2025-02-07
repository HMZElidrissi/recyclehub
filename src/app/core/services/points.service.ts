import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import {
  COUPON_OPTIONS,
  CouponOption,
  POINTS_PER_KG,
} from '@core/models/point.interface';
import {
  CollectionRequest,
  WasteType,
} from '@core/models/collection.interface';
import { User } from '@core/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class PointsService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  calculatePoints(request: CollectionRequest): number {
    if (!request.actualWeight) return 0;

    const weightInKg = request.actualWeight / 1000;

    return request.wasteTypes.reduce((total, type) => {
      switch (type) {
        case WasteType.PLASTIC:
          return total + weightInKg * POINTS_PER_KG.PLASTIC;
        case WasteType.GLASS:
          return total + weightInKg * POINTS_PER_KG.GLASS;
        case WasteType.PAPER:
          return total + weightInKg * POINTS_PER_KG.PAPER;
        case WasteType.METAL:
          return total + weightInKg * POINTS_PER_KG.METAL;
        default:
          return total;
      }
    }, 0);
  }

  convertPointsToCoupon(option: CouponOption): Observable<User> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    if (!currentUser.points || currentUser.points < option.points) {
      return throwError(() => new Error('Insufficient points'));
    }

    const updatedPoints = currentUser.points - option.points;

    return this.http
      .patch<User>(`${this.apiUrl}/${currentUser.id}`, {
        points: updatedPoints,
      })
      .pipe(
        tap((updatedUser) => {
          this.authService.currentUserSubject.next(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }),
        catchError((error) =>
          throwError(
            () => new Error(`Failed to convert points: ${error.message}`),
          ),
        ),
      );
  }

  getAvailableCoupons(userPoints: number): CouponOption[] {
    return COUPON_OPTIONS.filter((option) => userPoints >= option.points);
  }
}
