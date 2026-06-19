import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IUser } from '@libs/utils';
import { Observable } from 'rxjs';
import { IUpdatePasswordPayload, IUpdateProfilePayload } from '../interfaces';

@Service()
export class AuthService {
  private http = inject(HttpClient);

  signOut(): Observable<void> {
    return this.http.post<void>('/auth/signout', {});
  }

  updateProfile(dto: IUpdateProfilePayload): Observable<IUser> {
    return this.http.patch<IUser>('/auth/me', dto);
  }

  updatePassword(dto: IUpdatePasswordPayload): Observable<void> {
    return this.http.patch<void>('/auth/password', dto);
  }

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>('/auth/me');
  }
}
