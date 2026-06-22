import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '@libs/utils';
import { Observable } from 'rxjs';
import { IUserPayload, IUserQuery } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  create(dto: IUserPayload): Observable<IUser> {
    return this.http.post<IUser>('/users', dto);
  }

  delete(userId: string): Observable<void> {
    return this.http.delete<void>(`/users/${userId}`);
  }

  exportCsv(query: IUserQuery): Observable<Blob> {
    return this.http.get('/users/export/csv', {
      params: this.createParams(query),
      responseType: 'blob'
    });
  }

  findAll(query: IUserQuery): Observable<[IUser[], number]> {
    return this.http.get<[IUser[], number]>('/users', { params: this.createParams(query) });
  }

  findOneByEmail(email: string): Observable<IUser> {
    return this.http.get<IUser>(`/users/${encodeURIComponent(email)}`);
  }

  importCsv(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>('/users/import/csv', formData);
  }

  update(userId: string, dto: IUserPayload): Observable<IUser> {
    return this.http.patch<IUser>(`/users/${userId}`, dto);
  }

  private createParams(query: IUserQuery): HttpParams {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
