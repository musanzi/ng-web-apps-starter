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
  private apiUrl = environment.apiUrl;

  signUp(dto: ISignUpPayload): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl + '/auth/signup', dto);
  }

  signIn(dto: ISignInPayload): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl + '/auth/signin', dto);
  }

  signOut(): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/auth/signout', {});
  }

  forgotPassword(dto: IForgotPasswordPayload): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/auth/password/forgot', dto);
  }

  resetPassword(dto: IResetPasswordPayload): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/auth/password/reset', dto);
  }

  updateProfile(dto: IUpdateProfilePayload): Observable<IUser> {
    return this.http.patch<IUser>(this.apiUrl + '/auth/me', dto);
  }

  updatePassword(dto: IUpdatePasswordPayload): Observable<void> {
    return this.http.patch<void>(this.apiUrl + '/auth/password', dto);
  }

  getGoogleSignInUrl(): string {
    return this.apiUrl + '/auth/signin/google';
  }

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(this.apiUrl + '/auth/me');
  }
}
