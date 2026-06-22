import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRole } from '@libs/utils';
import { Observable } from 'rxjs';
import { IRolePayload, IRoleQuery } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);

  create(dto: IRolePayload): Observable<IRole> {
    return this.http.post<IRole>('/roles', dto);
  }

  delete(roleId: string): Observable<void> {
    return this.http.delete<void>(`/roles/${roleId}`);
  }

  findAll(query: IRoleQuery): Observable<[IRole[], number]> {
    return this.http.get<[IRole[], number]>('/roles', { params: this.createParams(query) });
  }

  findOne(roleId: string): Observable<IRole> {
    return this.http.get<IRole>(`/roles/${roleId}`);
  }

  update(roleId: string, dto: IRolePayload): Observable<IRole> {
    return this.http.patch<IRole>(`/roles/${roleId}`, dto);
  }

  private createParams(query: IRoleQuery): HttpParams {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
