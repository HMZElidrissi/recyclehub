import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Role, User } from '@core/models/user.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          const user = users[0];
          if (!user) {
            throw new Error('Invalid email or password');
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError((error) => {
          if (error.message) {
            return throwError(() => error);
          }
          return throwError(
            () => new Error('Login failed. Please try again later.'),
          );
        }),
      );
  }

  register(userData: Omit<User, 'id' | 'role' | 'points'>): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${userData.email}`).pipe(
      map((users) => {
        if (users.length > 0) {
          throw new Error('Email already exists');
        }
        return userData;
      }),
      switchMap((userData: Omit<User, 'id' | 'role' | 'points'>) => {
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
          role: Role.PARTICULAR,
          points: 0,
        };
        return this.http.post<User>(this.apiUrl, newUser);
      }),
      catchError((error) => {
        if (error.message) {
          return throwError(() => error);
        }
        return throwError(
          () => new Error('Registration failed. Please try again later.'),
        );
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
