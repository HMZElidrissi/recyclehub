import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { User } from '@core/models/user.interface';
import { AuthService } from './auth.service';

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  updateProfile(id: string, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, userData).pipe(
      tap((updatedUser) => {
        if (this.authService.getCurrentUser()?.id === id) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.authService.currentUserSubject.next(updatedUser);
        }
      }),
      catchError(() =>
        throwError(() => new Error('Update failed. Please try again later.')),
      ),
    );
  }

  updatePassword(id: string, passwordData: PasswordUpdate): Observable<User> {
    return this.verifyPassword(id, passwordData.currentPassword).pipe(
      switchMap((isValid) => {
        if (!isValid) {
          return throwError(() => new Error('Current password is incorrect'));
        }
        return this.updateProfile(id, { password: passwordData.newPassword });
      }),
    );
  }

  private verifyPassword(id: string, password: string): Observable<boolean> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map((user) => user.password === password),
      catchError(() =>
        throwError(() => new Error('Failed to verify password')),
      ),
    );
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this.authService.getCurrentUser()?.id === id) {
          this.authService.logout();
        }
      }),
      catchError(() =>
        throwError(
          () => new Error('Failed to delete account. Please try again later.'),
        ),
      ),
    );
  }
}
