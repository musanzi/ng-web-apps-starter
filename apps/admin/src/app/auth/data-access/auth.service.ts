import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IUser } from '@libs/utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUpdatePasswordPayload, IUpdateProfilePayload } from '../interfaces';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  signOut(): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/auth/signout', {});
  }

  updateProfile(dto: IUpdateProfilePayload): Observable<IUser> {
    return this.http.patch<IUser>(this.apiUrl + '/auth/me', dto);
  }

  updatePassword(dto: IUpdatePasswordPayload): Observable<void> {
    return this.http.patch<void>(this.apiUrl + '/auth/password', dto);
  }

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(this.apiUrl + '/auth/me');
  }
}
