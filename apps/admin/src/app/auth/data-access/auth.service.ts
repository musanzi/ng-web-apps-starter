import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IAuthProfile, IUpdatePasswordPayload, IUpdateProfilePayload } from '../interfaces';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  signOut() {
    return this.http.post<void>(this.apiUrl + '/auth/signout', {});
  }

  updateProfile(dto: IUpdateProfilePayload) {
    return this.http.patch<IAuthProfile>(this.apiUrl + '/auth/me', dto);
  }

  updatePassword(dto: IUpdatePasswordPayload) {
    return this.http.patch<void>(this.apiUrl + '/auth/password', dto);
  }

  getProfile() {
    return this.http.get<IAuthProfile>(this.apiUrl + '/auth/me');
  }
}
