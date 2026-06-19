import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IUser } from '@libs/utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IForgotPasswordPayload,
  IResetPasswordPayload,
  ISignInPayload,
  ISignUpPayload,
  IUpdatePasswordPayload,
  IUpdateProfilePayload
} from '../interfaces';

@Service()
export class AuthService {
  private http = inject(HttpClient);

  signUp(dto: ISignUpPayload): Observable<IUser> {
    return this.http.post<IUser>('/auth/signup', dto);
  }

  signIn(dto: ISignInPayload): Observable<IUser> {
    return this.http.post<IUser>('/auth/signin', dto);
  }

  signOut(): Observable<void> {
    return this.http.post<void>('/auth/signout', {});
  }

  forgotPassword(dto: IForgotPasswordPayload): Observable<void> {
    return this.http.post<void>('/auth/password/forgot', dto);
  }

  resetPassword(dto: IResetPasswordPayload): Observable<void> {
    return this.http.post<void>('/auth/password/reset', dto);
  }

  updateProfile(dto: IUpdateProfilePayload): Observable<IUser> {
    return this.http.patch<IUser>('/auth/me', dto);
  }

  updatePassword(dto: IUpdatePasswordPayload): Observable<void> {
    return this.http.patch<void>('/auth/password', dto);
  }

  getGoogleSignInUrl(): string {
    return environment + '/auth/signin/google';
  }

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>('/auth/me');
  }
}
