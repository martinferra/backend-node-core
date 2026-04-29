import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

import { User } from '../../../models/user/user.model';

import { TokenStorage } from './token.storage';

interface AuthResponse {
  token: string;
  user: User;
}

export interface UserInfo {
  exists: boolean;
  fullname: string;
  blankedPassword: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>('/api/auth/login', { email, password })
      .pipe(
        map(({ token, user }) => {
          this.tokenStorage.saveToken(token);
          return this.setUser(user);
        })
      );
  }

  register(
    fullname: string,
    email: string,
    password: string,
    repeatPassword: string
  ): Observable<User> {
    return this.http
      .post<AuthResponse>('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword,
      })
      .pipe(
        map(({ token, user }) => {
          this.tokenStorage.saveToken(token);
          return this.setUser(user);
        })
      );
  }

  setUser(user: any): User {
    let _user: User = plainToClass(User, user);
    this.user$.next(_user);
    return _user;
  }

  getUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  me(): Observable<User | null> {
    return this.http.get<AuthResponse>('/api/auth/me').pipe(
      map(({ user }) => this.setUser(user)),
      catchError(() => of(null))
    );
  }

  signOut(): void {
    this.tokenStorage.signOut();
    this.setUser(null);
  }

  getAuthorizationHeaders() {
    const token: string | null = this.tokenStorage.getToken() || '';
    return { Authorization: `Bearer ${token}` };
  }

  checkUser(email: string): Observable<any> {
    return this.http.post<UserInfo>('/api/auth/checkUser', { email });
  }

  addRegistrationReq(fullname: string, email: string): Observable<any> {
    return this.http.post<UserInfo>('/api/auth/addRegistrationReq', {
      fullname,
      email,
    });
  }

  /**
   * Let's try to get user's information if he was logged in previously,
   * thus we can ensure that the user is able to access the `/` (home) page.
   */
  checkTheUserOnTheFirstLoad(): Promise<User | null> {
    return firstValueFrom(this.me());
  }
}
