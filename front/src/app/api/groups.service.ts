import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Group } from './models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  // Asegúrate que apiBaseUrl tenga el prefijo /api, ej: http://localhost:4000/api
  private base = `${environment.apiBaseUrl}/groups`;

  /** GET /api/groups?enabled=true|false&q=texto */
  list(opts?: { enabled?: boolean; q?: string }): Observable<Group[]> {
    let params = new HttpParams();
    if (opts?.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts?.q) params = params.set('q', opts.q);

    return this.http
      .get<ApiResponse<Group[]>>(this.base, { params })
      .pipe(map((r) => r?.data ?? []));
  }

  /** POST /api/groups */
  create(payload: Pick<Group, 'name' | 'slug'> & Partial<Group>): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(this.base, payload)
      .pipe(map((r) => r.data));
  }

  /** PATCH /api/groups/:id/name */
  rename(id: string, name: string): Observable<Group> {
    return this.http
      .patch<ApiResponse<Group>>(`${this.base}/${id}/name`, { name })
      .pipe(map((r) => r.data));
  }

  /** POST /api/groups/:id/hide (enabled=false) */
  hide(id: string): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(`${this.base}/${id}/hide`, {})
      .pipe(map((r) => r.data));
  }

  /** POST /api/groups/:id/show (enabled=true) */
  show(id: string): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(`${this.base}/${id}/show`, {})
      .pipe(map((r) => r.data));
  }
}
