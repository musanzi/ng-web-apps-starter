import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  IForgotPasswordPayload,
  IAuthProfile,
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

  signUp(dto: ISignUpPayload) {
    return this.http.post<IAuthProfile>(this.apiUrl + '/auth/signup', dto);
  }

  signIn(dto: ISignInPayload) {
    return this.http.post<IAuthProfile>(this.apiUrl + '/auth/signin', dto);
  }

  signOut() {
    return this.http.post<void>(this.apiUrl + '/auth/signout', {});
  }

  forgotPassword(dto: IForgotPasswordPayload) {
    return this.http.post<void>(this.apiUrl + '/auth/password/forgot', dto);
  }

  resetPassword(dto: IResetPasswordPayload) {
    return this.http.post<void>(this.apiUrl + '/auth/password/reset', dto);
  }

  updateProfile(dto: IUpdateProfilePayload) {
    return this.http.patch<IAuthProfile>(this.apiUrl + '/auth/me', dto);
  }

  updatePassword(dto: IUpdatePasswordPayload) {
    return this.http.patch<void>(this.apiUrl + '/auth/password', dto);
  }

  getGoogleSignInUrl(): string {
    return this.apiUrl + '/auth/signin/google';
  }

  getProfile() {
    return this.http.get<IAuthProfile>(this.apiUrl + '/auth/me');
  }
}
