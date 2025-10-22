--- Archivo: /src/app/api/cards.service.ts ---

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Card, PaginationMeta } from './models';
import { environment } from '../../environments/environment';

export interface ListCardsOptions {
  groupId?: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
  q?: string;
  reverse?: boolean;
  shuffle?: boolean; // orden aleatorio paginado
}

@Injectable({ providedIn: 'root' })
export class CardsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/cards`;

  /** GET /api/cards ... paginado */
  list(opts: ListCardsOptions = {}): Observable<{ data: Card[]; meta: PaginationMeta }> {
    let params = new HttpParams();
    if (opts.groupId) params = params.set('groupId', opts.groupId);
    if (opts.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    if (opts.q) params = params.set('q', opts.q);
    if (opts.reverse !== undefined) params = params.set('reverse', String(opts.reverse));
    if (opts.shuffle !== undefined) params = params.set('shuffle', String(opts.shuffle));

    return this.http.get<ApiResponse<Card[]>>(`${this.base}`, { params }).pipe(
      map(r => ({ data: r.data, meta: r.meta as PaginationMeta }))
    );
  }

  /** GET /api/cards/random ... sin paginado */
  random(opts: { groupId?: string; enabled?: boolean; count?: number; reverse?: boolean } = {}): Observable<Card[]> {
    let params = new HttpParams();
    if (opts.groupId) params = params.set('groupId', opts.groupId);
    if (opts.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts.count) params = params.set('count', String(opts.count));
    if (opts.reverse !== undefined) params = params.set('reverse', String(opts.reverse));

    return this.http.get<ApiResponse<Card[]>>(`${this.base}/random`, { params }).pipe(map(r => r.data));
  }

  /** GET /api/cards/group/:groupId ... alternativa por ruta */
  listByGroup(groupId: string, opts: Omit<ListCardsOptions, 'groupId'> = {}): Observable<{ data: Card[]; meta: PaginationMeta }> {
    let params = new HttpParams();
    if (opts.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    if (opts.q) params = params.set('q', opts.q);
    if (opts.reverse !== undefined) params = params.set('reverse', String(opts.reverse));
    if (opts.shuffle !== undefined) params = params.set('shuffle', String(opts.shuffle));

    return this.http.get<ApiResponse<Card[]>>(`${this.base}/group/${groupId}`, { params }).pipe(
      map(r => ({ data: r.data, meta: r.meta as PaginationMeta }))
    );
  }

  /** POST /api/cards */
  create(payload: Omit<Card, '_id' | 'createdAt' | 'updatedAt'>): Observable<Card> {
    return this.http.post<ApiResponse<Card>>(this.base, payload).pipe(map(r => r.data));
  }

  /** PATCH /api/cards/:id */
  update(id: string, patch: Partial<Omit<Card, '_id'>>): Observable<Card> {
    return this.http.patch<ApiResponse<Card>>(`${this.base}/${id}`, patch).pipe(map(r => r.data));
  }

  /** POST /api/cards/:id/hide */
  hide(id: string): Observable<Card> {
    return this.http.post<ApiResponse<Card>>(`${this.base}/${id}/hide`, {}).pipe(map(r => r.data));
  }

  /** POST /api/cards/:id/show */
  show(id: string): Observable<Card> {
    return this.http.post<ApiResponse<Card>>(`${this.base}/${id}/show`, {}).pipe(map(r => r.data));
  }
}

```

--- Archivo: /src/app/api/groups.service.ts ---

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Group } from './models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/groups`;

  list(opts?: { enabled?: boolean; q?: string }): Observable<Group[]> {
    let params = new HttpParams();
    if (opts?.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts?.q) params = params.set('q', opts.q);
    return this.http
      .get<ApiResponse<Group[]>>(this.base, { params })
      .pipe(map((r) => r?.data ?? []));
  }

  create(payload: Pick<Group, 'name' | 'slug'> & Partial<Group>): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(this.base, payload)
      .pipe(map((r) => r.data));
  }

  // --- MÉTODO REEMPLAZADO ---
  /**
   * PATCH /api/groups/:id
   * Actualiza parcialmente un grupo.
   */
  update(id: string, payload: Partial<Group>): Observable<Group> {
    return this.http
      .patch<ApiResponse<Group>>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  hide(id: string): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(`${this.base}/${id}/hide`, {})
      .pipe(map((r) => r.data));
  }

  show(id: string): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(`${this.base}/${id}/show`, {})
      .pipe(map((r) => r.data));
  }
}

```

--- Archivo: /src/app/api/models.ts ---

```ts
export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  meta?: any;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  shuffled?: boolean;
}

export interface Group {
    _id: string;
    name: string;
    description: string;
    slug: string;
    enabled: boolean;
}

export interface Card {
  _id: string;
  english: string;
  spanish: string;
  imageUrl?: string | null;
  groupId: string;
  order?: number;
  enabled: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

```

--- Archivo: /src/app/app.component.css ---

```css

:host { display: flex; flex-direction: column; min-height: 100vh; }
.page { flex: 1 1 auto; padding: 2rem 0; }

/* Tarjeta base para páginas (blanco moderno) */
.section-card {
  background: var(--surface-0);
  padding: 2rem;
  border: 1px solid rgba(148, 163, 184, 0.12);
}

```

--- Archivo: /src/app/app.component.html ---

```html
<app-header></app-header>

<main class="page">
  <div class="container">
    <section class="section-card elev-1 round">
      <router-outlet></router-outlet>
    </section>
  </div>
</main>

<app-footer></app-footer>

```

--- Archivo: /src/app/app.component.spec.ts ---

```ts
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'bases' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('bases');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, bases');
  });
});

```

--- Archivo: /src/app/app.component.ts ---

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { EjemploComponent } from './examples/example1';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, EjemploComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Alejandro app';
}

```

--- Archivo: /src/app/app.config.ts ---

```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    providePrimeNG({
      /* options */
    }),
  ],
};

```

--- Archivo: /src/app/app.routes.ts ---

```ts
import { Routes } from '@angular/router';
import { ListGroupsPage } from './pages/list-groups/list-groups.page';
import { ListCardsComponent } from './pages/list-cards/list-cards.page';
import { AdminViewComponent } from './components/admin/admin-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-groups',
    pathMatch: 'full'
  },

  {
    path: 'list-groups',
    component: ListGroupsPage
  },

  {
    path: 'list-cards/:id',
    component: ListCardsComponent
  },

    {
    path: 'admin',
    component: AdminViewComponent
  },

  {
    path: '**',
    redirectTo: 'list-groups'
  }

];

```

--- Archivo: /src/app/components/admin/admin-groups/admin-groups.component.css ---

```css
/* --- INICIO: CÓDIGO DEL BUSCADOR AÑADIDO --- */
/* (Copiado de list-groups.page.css) */
.searchbar {
  display: grid;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 0; /* Anulamos el margen del ejemplo */
}

/* Asumimos que estas variables están definidas globalmente
  en tu proyecto, ya que tu archivo de ejemplo las usaba
  pero no las definía.
*/
.searchbar__group {
  border-radius: 12px;
  background: var(--surface-0, #fff); /* Fallback a blanco */
  transition: box-shadow 0.2s ease, transform 0.12s ease, border-color 0.2s ease;
  overflow: hidden;
  border: 1px solid var(--search-border, var(--ngx-border-color)); /* Fallback a ngx */
}

.searchbar__group:focus-within {
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08),
    0 0 0 4px var(--search-focus-ring, rgba(51, 102, 255, 0.2)); /* Fallback a ngx */
  border-color: var(--brand-300, var(--ngx-primary-color)); /* Fallback a ngx */
  transform: translateY(-1px);
}

.searchbar__icon {
  background: transparent;
  border: 0 !important;
  color: var(--search-icon, var(--ngx-text)); /* Fallback a ngx */
  padding-inline: 0.9rem;
  display: inline-flex;
  align-items: center;
}

.search-input.p-inputtext,
.search-input {
  width: 90%;
  border: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  color: var(--text-900, var(--ngx-text)); /* Fallback a ngx */
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: var(--search-placeholder, #999); /* Fallback a gris */
}

.searchbar__clear.p-button {
  border: 0;
  background: transparent;
  color: var(--search-placeholder, #999); /* Fallback a gris */
  padding: 0 0.6rem;
  transition: color 0.15s ease, background 0.15s ease;
}

.searchbar__clear.p-button:hover {
  background: rgba(96, 165, 250, 0.1);
  color: var(--brand-600, var(--ngx-primary-color)); /* Fallback a ngx */
}
/* --- FIN: CÓDIGO DEL BUSCADOR AÑADIDO --- */

/* Variables de estilo para el tema NGX-Admin */
:host {
  --ngx-bg: #fff;
  --ngx-text: #2a2a2a;
  --ngx-border-color: #ebeef2;
  --ngx-header-bg: #f7f9fc;
  --ngx-row-hover-bg: #f7f9fc;
  --ngx-primary-color: #3366ff;
  --ngx-success-color: #00d68f;
  --ngx-danger-color: #ff3d71;
  --ngx-paginator-hover-bg: #eef2f7;
}

/* Contenedor principal que simula una 'nb-card' */
.ngx-style-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--ngx-border-color);
  overflow: hidden;
  background-color: var(--ngx-bg);
}

/* Estilos aplicados a la tabla de PrimeNG */
:host ::ng-deep .p-datatable-ngx .p-datatable-header {
  background-color: var(--ngx-bg);
  border-bottom: 1px solid var(--ngx-border-color);
  padding: 1rem 1.25rem;
}

:host ::ng-deep .p-datatable-ngx .p-datatable-thead > tr > th {
  background-color: var(--ngx-header-bg);
  color: var(--ngx-text);
  font-weight: 600;
  border: none;
  border-bottom: 1px solid var(--ngx-border-color);
  padding: 1rem 1.25rem;
  text-align: left;
}

:host ::ng-deep .p-datatable-ngx .p-datatable-tbody > tr {
  transition: background-color 0.2s ease;
}

:host ::ng-deep .p-datatable-ngx .p-datatable-tbody > tr:hover {
  background-color: var(--ngx-row-hover-bg) !important;
}

:host ::ng-deep .p-datatable-ngx .p-datatable-tbody > tr > td {
  border-bottom: 1px solid var(--ngx-border-color) !important;
  padding: 1rem 1.25rem;
  color: var(--ngx-text);
}

/* --- ESTILOS MEJORADOS PARA EL BOTÓN Y SU CONTENEDOR --- */

/* 8. MODIFICADO EL TOOLBAR CONTAINER */
.toolbar-container {
  display: flex;
  justify-content: space-between; /* Alinea buscador a la izq. y botón a la der. */
  align-items: center; /* Centra verticalmente */
  padding: 1rem 1.25rem;
  background-color: var(--ngx-bg);
  border-bottom: 1px solid var(--ngx-border-color);
  gap: 1rem; /* Espacio entre buscador y botón */
}

.add-button.p-button {
  background-color: var(--ngx-primary-color) !important;
  border: 1px solid var(--ngx-primary-color) !important;
  color: #fff !important;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.1s ease;
  box-shadow: 0 2px 8px rgba(51, 102, 255, 0.2);
  flex-shrink: 0; /* Evita que el botón se encoja */
}

.add-button.p-button:hover {
  background-color: #407bff !important;
  border-color: #407bff !important;
  box-shadow: 0 4px 12px rgba(51, 102, 255, 0.3);
}

.add-button.p-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(51, 102, 255, 0.2);
}

/* Estilos para los botones de acción dentro de las filas */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-buttons .p-button {
  transition: color 0.2s ease;
}

.action-buttons .action-edit:hover {
  color: var(--ngx-primary-color);
}
.action-buttons .action-save:hover {
  color: var(--ngx-success-color);
}
.action-buttons .action-cancel:hover {
  color: var(--ngx-danger-color);
}
.action-buttons .action-toggle:hover {
  color: #ffc94d;
}

input,
textarea {
  border: 1px solid;
  border-color: var(--brand-500);
  background-color: rgba(37, 99, 235, 0.05);
      border-radius: 12px;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.15);
}

```

--- Archivo: /src/app/components/admin/admin-groups/admin-groups.component.html ---

```html
<p-toast></p-toast>

<div class="ngx-style-card">

  <div class="toolbar-container">

    <div class="searchbar">
      <div class="p-inputgroup searchbar__group">
        <span class="p-inputgroup-addon searchbar__icon" aria-hidden="true"><i class="pi pi-search"></i></span>
        <input
          id="group-search"
          type="text"
          pInputText
          class="search-input"
          placeholder="Buscar por nombre o descripción…"
          [(ngModel)]="searchTerm"
          (input)="filterGroups()"
          autocomplete="off"
        />
        <button
          pButton
          type="button"
          class="p-button-text p-button-rounded p-inputgroup-addon searchbar__clear"
          *ngIf="searchTerm"
          (click)="searchTerm=''; filterGroups()"
          aria-label="Limpiar búsqueda"
          title="Limpiar"
        ><i class="pi pi-times"></i></button>
      </div>
    </div>
    <button pButton pRipple type="button" label="Añadir Tema" icon="pi pi-plus"
            class="p-button-primary add-button"
            (click)="addNewGroupRow()"
            [disabled]="isAddingNewRow"></button>
  </div>

  <p-table
    #pTable
    [value]="paginatedGroups" dataKey="_id"
    editMode="row"
    styleClass="p-datatable-ngx"
    [tableStyle]="{'min-width': '50rem'}"
    sortMode="multiple"
  >
    <ng-template pTemplate="header">
      <tr>
        <th style="width:25%" pSortableColumn="name">Nombre <p-sortIcon field="name"></p-sortIcon></th>
        <th style="width:40%" pSortableColumn="description">Descripción <p-sortIcon field="description"></p-sortIcon></th>
        <th style="width:10rem" class="text-center">Nº Tarjetas</th>
        <th class="text-center">Visible</th>
        <th style="width:10rem" class="text-center">Acciones</th>
      </tr>
    </ng-template>

    <ng-template pTemplate="body" let-group let-editing="editing" let-ri="rowIndex">
      <tr [pEditableRow]="group">
        <td>
          <p-cellEditor>
            <ng-template pTemplate="input"><input pInputText type="text" [(ngModel)]="group.name" class="p-inputtext-sm"></ng-template>
            <ng-template pTemplate="output">{{ group.name }}</ng-template>
          </p-cellEditor>
        </td>
        <td>
          <p-cellEditor>
            <ng-template pTemplate="input"><textarea pTextarea [(ngModel)]="group.description" rows="3" class="w-full p-inputtext-sm"></textarea></ng-template>
            <ng-template pTemplate="output">{{ group.description }}</ng-template>
          </p-cellEditor>
        </td>
        <td class="text-center">0</td>
        <td class="text-center">
          <p-tag [value]="group.enabled ? 'Sí' : 'No'" [severity]="group.enabled ? 'success' : 'danger'"></p-tag>
        </td>
        <td class="text-center">
          <div class="action-buttons">
            <button *ngIf="!editing" pButton pRipple type="button" icon="pi pi-pencil"
                    class="p-button-rounded p-button-text action-edit"
                    pInitEditableRow
                    (click)="onRowEditInit(group)"></button>

            <button *ngIf="editing" pButton pRipple type="button" icon="pi pi-check" class="p-button-rounded p-button-text action-save"
                    (click)="manualSave(group, ri)"></button>

            <button *ngIf="editing" pButton pRipple type="button" icon="pi pi-times" class="p-button-rounded p-button-text action-cancel"
                    (click)="manualCancel(group, ri)"></button>

            <button pButton pRipple type="button" [icon]="group.enabled ? 'pi pi-eye-slash' : 'pi pi-eye'" (click)="toggleGroupStatus(group)"></button>
          </div>
        </td>
      </tr>
    </ng-template>

    <ng-template pTemplate="emptymessage">
      <tr *ngIf="filteredGroups.length === 0 && searchTerm">
        <td colspan="5" class="text-center p-5">
          No se encontraron temas que coincidan con "{{ searchTerm }}".
        </td>
      </tr>
      <tr *ngIf="filteredGroups.length === 0 && !searchTerm">
        <td colspan="5" class="text-center p-5">No se encontraron temas.</td>
      </tr>
    </ng-template>
  </p-table>


</div>

<div>
    <app-custom-paginator
    *ngIf="totalPages > 1"
    [currentPage]="currentPage"
    [totalPages]="totalPages"
    (pageChange)="onPageChange($event)"
    [label]="'Página'"
  ></app-custom-paginator>
</div>

```

--- Archivo: /src/app/components/admin/admin-groups/admin-groups.component.ts ---

```ts
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// Tu servicio y modelo
import { GroupsService } from '../../../api/groups.service';
import { Group } from '../../../api/models';

// Módulos PrimeNG
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

// --- 1. IMPORTAR EL COMPONENTE REUTILIZABLE ---
import { CustomPaginatorComponent } from '../../shared/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    RippleModule,
    CustomPaginatorComponent
  ],
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.css'],
  providers: [MessageService]
})
export class AdminGroupsComponent implements OnInit {

  @ViewChild('pTable') pTable!: Table;

  private groupsService = inject(GroupsService);
  private messageService = inject(MessageService);

  allGroups: Group[] = [];
  filteredGroups: Group[] = [];
  paginatedGroups: Group[] = [];
  clonedGroups: { [s: string]: Group } = {};

  isAddingNewRow: boolean = false;
  searchTerm: string = '';

  // Propiedades para la paginación
  rows: number = 10;
  currentPage: number = 1;

  get totalRecords(): number {
    return this.filteredGroups.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupsService.list().subscribe({
      next: (data) => {
        this.allGroups = data;
        this.filterGroups(); // Carga inicial y filtra
      },
      error: (_err: any) => {
        // --- TOAST DE ERROR (Carga) ---
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los temas' });
      }
    });
  }

  filterGroups(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredGroups = [...this.allGroups];
    } else {
      this.filteredGroups = this.allGroups.filter(group =>
        group.name.toLowerCase().includes(term) ||
        (group.description && group.description.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
    this.updatePaginatedView();
  }

  private updatePaginatedView(): void {
    const startIndex = (this.currentPage - 1) * this.rows;
    const endIndex = startIndex + this.rows;
    this.paginatedGroups = this.filteredGroups.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedView();
  }

  onRowEditInit(group: Group) {
    console.log("Iniciando edición de:", group.name);
    this.clonedGroups[group._id] = { ...group };
  }

  addNewGroupRow() {
    if (this.isAddingNewRow) return;
    this.isAddingNewRow = true;

    this.searchTerm = '';
    this.pTable.reset(); // Resetea la ordenación
    this.filterGroups(); // Carga todos los datos

    this.currentPage = 1;
    const tempId = `_new_${Date.now()}`;
    const newGroup: Group = {
      _id: tempId,
      name: '',
      description: '',
      slug: '',
      enabled: true
    };

    this.allGroups.unshift(newGroup);
    this.filteredGroups.unshift(newGroup);

    this.updatePaginatedView();

    setTimeout(() => {
      this.pTable.initRowEdit(newGroup);
      this.onRowEditInit(newGroup);
    }, 0);
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD') // Quitar acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-') // Espacios por guiones
      .replace(/[^\w-]+/g, '') // Quitar caracteres especiales
      .replace(/--+/g, '-'); // Quitar guiones duplicados
  }

  manualSave(group: Group, index: number) {
    console.log("--- MANUAL SAVE (CLICK) ---");

    const isNew = group._id.startsWith('_new_');

    if (isNew) {
      // --- LÓGICA DE CREAR (POST) ---
      if (!group.name || group.name.trim() === '') {
        // --- TOAST DE ERROR (Validación) ---
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio' });
        return;
      }

      const slug = this.slugify(group.name);
      const payload: Pick<Group, 'name' | 'slug' | 'description'> = {
        name: group.name,
        slug: slug,
        description: group.description
      };

      this.groupsService.create(payload).subscribe({
        next: () => {
          // --- TOAST DE ÉXITO (Crear) ---
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tema creado' });
          delete this.clonedGroups[group._id];
          this.isAddingNewRow = false;
          this.loadGroups();
        },
        error: (err: any) => {
          // --- TOASTS DE ERROR (Crear) ---
          if (err.status === 409) {
             this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'El nombre o slug ya existe' });
          } else {
             this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el tema' });
          }
        }
      });

    } else {
      // --- LÓGICA DE ACTUALIZAR (PATCH) ---
      const originalGroup = this.clonedGroups[group._id];
      if (!originalGroup) {
        console.error("Error: No se encontró el grupo original clonado.");
        return;
      }

      const payload: Partial<Group> = {};
      if (originalGroup.name !== group.name) payload.name = group.name;
      if (originalGroup.description !== group.description) payload.description = group.description;

      if (Object.keys(payload).length > 0) {
        this.groupsService.update(group._id, payload).subscribe({
          next: (updatedGroup: Group) => {
            // --- TOAST DE ÉXITO (Actualizar) ---
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tema actualizado' });

            const idxAll = this.allGroups.findIndex(g => g._id === updatedGroup._id);
            if (idxAll > -1) this.allGroups[idxAll] = updatedGroup;

            const idxFiltered = this.filteredGroups.findIndex(g => g._id === updatedGroup._id);
            if (idxFiltered > -1) this.filteredGroups[idxFiltered] = updatedGroup;

            this.updatePaginatedView();
            this.pTable.cancelRowEdit(group);
            delete this.clonedGroups[group._id];
          },
          error: (_err: any) => {
            // --- TOAST DE ERROR (Actualizar) ---
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el tema' });
            this.manualCancel(group, index);
          }
        });
      } else {
        console.log("Sin cambios, saliendo del modo edición...");
        this.pTable.cancelRowEdit(group);
        delete this.clonedGroups[group._id];
      }
    }
  }

  manualCancel(group: Group, index: number) {
    console.log("--- MANUAL CANCEL (CLICK) ---");

    const isNew = group._id.startsWith('_new_');

    if (isNew) {
      // --- LÓGICA DE CANCELAR NUEVO ---
      this.allGroups.shift();
      this.filteredGroups.shift();

      this.updatePaginatedView();
      delete this.clonedGroups[group._id];
      this.isAddingNewRow = false;

    } else {
      // --- LÓGICA DE CANCELAR EDICIÓN ---
      const originalGroup = this.clonedGroups[group._id];
      if (originalGroup) {

        const idxAll = this.allGroups.findIndex(g => g._id === originalGroup._id);
        if (idxAll > -1) this.allGroups[idxAll] = originalGroup;

        const idxFiltered = this.filteredGroups.findIndex(g => g._id === originalGroup._id);
        if (idxFiltered > -1) this.filteredGroups[idxFiltered] = originalGroup;

        this.updatePaginatedView();
        delete this.clonedGroups[group._id];
      }
      this.pTable.cancelRowEdit(group);
    }
  }

  toggleGroupStatus(group: Group): void {
    const action = group.enabled ? this.groupsService.hide(group._id) : this.groupsService.show(group._id);
    action.subscribe({
      next: (updatedGroup: Group) => {

        const idxAll = this.allGroups.findIndex(g => g._id === updatedGroup._id);
        if (idxAll > -1) this.allGroups[idxAll].enabled = updatedGroup.enabled;

        const idxFiltered = this.filteredGroups.findIndex(g => g._id === updatedGroup._id);
        if (idxFiltered > -1) this.filteredGroups[idxFiltered].enabled = updatedGroup.enabled;

        this.updatePaginatedView();
        // --- TOAST DE INFO (Ocultar/Mostrar) ---
        this.messageService.add({ severity: 'info', summary: 'Actualizado', detail: 'Visibilidad cambiada' });
      },
      error: (_err: any) => {
        // --- TOAST DE ERROR (Ocultar/Mostrar) ---
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar la visibilidad' })
      }
    });
  }

  // Esta función ya no se usa, la hemos reemplazado por addNewGroupRow
  createNewGroup(): void {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Función no implementada' });
  }
}

```

--- Archivo: /src/app/components/admin/admin-view.component.css ---

```css

/* Estilos para la cabecera de la página de administración */
.admin-header {
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-2);
}


/* Contenedor para los nuevos selectores de vista */
.view-selector-grid {
  display: flex;
  gap: 1rem;
  padding-top: 0.5rem;
}


/* --- Estilos para los elementos de selección --- */

.group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  width: 130px;
  padding: 1rem;
  min-height: 100px;
  justify-content: center;

  border: 1px solid var(--surface-2);
  border-radius: 12px;
  cursor: pointer;
  background-color: var(--surface-0);
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05);
}

.group-item:hover {
  border-color: var(--brand-300);
  box-shadow: 0 5px 12px rgba(15, 23, 42, 0.1);
  transform: translateY(-3px);
}

/* --- Estilos para el elemento activo --- */
.group-item.active {
  border-color: var(--brand-500);
  background-color: rgba(37, 99, 235, 0.05);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.15);
}

.group-item.active .folder-icon,
.group-item.active .group-name {
  color: var(--brand-600);
}


.group-content-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.folder-icon {
  font-size: 2.5rem;
  color: var(--text-700);
  margin-bottom: 0.75rem;
  transition: all 0.2s ease-in-out;
}

.group-item:hover .folder-icon {
    color: var(--brand-500);
    transform: scale(1.05);
}

.group-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-900);
  transition: color 0.2s ease-in-out;
}


```

--- Archivo: /src/app/components/admin/admin-view.component.html ---

```html
<div class="admin-view container">
  <header class="admin-header">
    <div class="header-content">
      <h1 class="page-title">Administración</h1>
      <p class="page-subtitle text-700">
        Selecciona una sección para gestionar su contenido.
      </p>
    </div>

    <!-- NAVEGACIÓN VISUAL CON LOS NUEVOS ELEMENTOS -->
    <div class="view-selector-grid">
      <!-- Elemento para Temas/Grupos (CON CAMBIOS) -->
      <div
        class="group-item"
        (click)="selectedView = 'groups'"
        [class.active]="selectedView === 'groups'"
        (mouseenter)="hoveredView = 'groups'"
        (mouseleave)="hoveredView = null"
      >
        <div class="group-content-grid">
          <i
            class="folder-icon"
            [ngClass]="
              hoveredView === 'groups' || selectedView === 'groups'
                ? 'pi pi-folder-open'
                : 'pi pi-folder'
            "
          ></i>
          <div class="group-info">
            <span class="group-name">Temas</span>
          </div>
        </div>
      </div>

      <!-- Elemento para Tarjetas (CON CAMBIOS) -->
      <div
        class="group-item"
        (click)="selectedView = 'cards'"
        [class.active]="selectedView === 'cards'"
        (mouseenter)="hoveredView = 'cards'"
        (mouseleave)="hoveredView = null"
      >
        <div class="group-content-grid">
          <!-- Nota: pi-table no tiene un estado 'open', por lo que solo se aplican los efectos CSS -->
          <i
            class="pi folder-icon"
            [ngClass]="
              hoveredView === 'cards' || selectedView === 'cards'
                ? 'pi-file-edit'
                : 'pi-file'
            "
          ></i>
          <div class="group-info">
            <span class="group-name">Tarjetas</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- El contenido cambia según la vista seleccionada -->
  <main class="admin-content mt-2">
    <div [ngSwitch]="selectedView">
      <!-- Carga el componente de gestión de Grupos -->
      <app-admin-groups *ngSwitchCase="'groups'"></app-admin-groups>

      <!-- Carga el componente de gestión de Tarjetas -->
      <div *ngSwitchCase="'cards'">MIAUUU</div>
      <!-- <app-admin-cards *ngSwitchCase="'cards'"></app-admin-cards> -->
    </div>
  </main>
</div>

```

--- Archivo: /src/app/components/admin/admin-view.component.ts ---

```ts
import { TabsModule } from 'primeng/tabs';

// PrimeNG (mismo set básico que tu ejemplo)
import { SelectButtonModule } from 'primeng/selectbutton';

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Los componentes hijos que se mostrarán
import { AdminGroupsComponent } from './admin-groups/admin-groups.component';

// Importa los nuevos componentes que crearemos
// import { AdminCardsComponent } from '../admin-cards/admin-cards.component';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminGroupsComponent,
    //AdminCardsComponent
  ],
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent {

  // Vista seleccionada por defecto, que determinará qué componente se muestra
  selectedView: 'groups' | 'cards' = 'groups';

    // Propiedad para controlar qué elemento tiene el hover
  public hoveredView: 'groups' | 'cards' | null = null;
}


```

--- Archivo: /src/app/components/main/card/card-view.component.css ---

```css
/* 1. Contenedor a pantalla completa */
.card-view-fullscreen {
  /* Ocupa el espacio restante de la ventana menos la altura del header (80px asumidos) */
  height: calc(100vh - 80px);
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #f4f4f4;
}

/* 2. Estilos para el contenedor de la tarjeta */
.card-wrapper {
  perspective: 1000px; /* Habilita el espacio 3D */
  width: 90%;
  max-width: 800px; /* Limita el ancho para que no sea excesivamente grande */
  height: 90%;
  max-height: 500px; /* Limita la altura de la tarjeta */
  display: flex;
  justify-content: center;
  align-items: center;
}

.flashcard-container {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d; /* Permite que los hijos se posicionen en 3D */
  cursor: pointer;
}

/* 3. Volteo de tarjeta */
.flashcard-container.flipped {
  transform: rotateY(180deg);
}

.flashcard-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Oculta la cara trasera cuando está al frente */

  /* Flexbox para centrar el contenido */
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.flashcard-front {
  background-color: white;
}

.flashcard-back {
  background-color: var(--primary-color, #42A5F5);
  color: white;
  transform: rotateY(180deg); /* Mueve la cara trasera a su posición inicial */
}

/* 4. Contenido grande y centrado dentro de la tarjeta */
.card-content-large {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  padding: 20px;
}

/* Asegurar que el título de la tarjeta trasera sea blanco */
.flashcard-back :host ::ng-deep .p-card-header {
    color: white !important;
}

/* 5. Controles de navegación y acciones */
.card-controls {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.bottom-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

```

--- Archivo: /src/app/components/main/card/card-view.component.html ---

```html
<!-- Contenedor principal que ocupa toda la ventana disponible -->
<div class="card-view-fullscreen">

  <!-- Controles de Navegación y Contador -->
  <div class="card-controls top-controls">
    <p-button
      icon="pi pi-angle-left"
      (onClick)="prevCard()"
      styleClass="p-button-rounded p-button-text p-button-lg"
      pRipple
    />
    <div class="text-xl font-medium counter-text">
      Tarjeta **{{ currentIndex() + 1 }}** de **{{ cards().length }}**
      <span *ngIf="currentCard()"> (Categoría: {{ currentCard()?.category }})</span>
    </div>
    <p-button
      icon="pi pi-angle-right"
      (onClick)="nextCard()"
      styleClass="p-button-rounded p-button-text p-button-lg"
      pRipple
    />
  </div>

  <!-- Contenedor de la Tarjeta (Centro de la pantalla) -->
  <div class="card-wrapper">
    @if (currentCard()) {
      <!-- El contenedor de la tarjeta aplica la clase 'flipped' para rotar -->
      <div class="flashcard-container" [class.flipped]="isFlipped()">

        <!-- Cara Frontal (Término) -->
        <p-card
          class="flashcard-face flashcard-front"
          (click)="flipCard()"
          header="Término"
          [subheader]="currentCard()?.category"
        >
          <div class="card-content-large">
            {{ currentCard()?.term }}
          </div>
        </p-card>

        <!-- Cara Trasera (Definición) -->
        <p-card
          class="flashcard-face flashcard-back"
          (click)="flipCard()"
          header="Definición"
          [subheader]="currentCard()?.term"
        >
          <div class="card-content-large">
            {{ currentCard()?.definition }}
          </div>
        </p-card>

      </div>
    } @else {
      <p-card header="Sin Tarjetas">
        Este grupo no contiene tarjetas o el grupo está cargando.
      </p-card>
    }
  </div>

  <!-- Botones Inferiores (Shuffle y Voltear) -->
  <div class="bottom-actions">
    <p-button
      label="Aleatorio (Shuffle)"
      icon="pi pi-shuffle"
      (onClick)="shuffleCard()"
      pRipple
      class="p-button-danger"
      [disabled]="cards().length <= 1"
    />
    <p-button
      label="Voltear (Espacio)"
      icon="pi pi-refresh"
      (onClick)="flipCard()"
      pRipple
      class="p-button-primary"
    />
  </div>
</div>

```

--- Archivo: /src/app/components/main/card/card-view.component.ts ---

```ts
import { Component, OnInit, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// PrimeNG Modules [2]
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// --- MOCK INTERFACES (Asumidas de la estructura DB/Backend) ---
interface Card {
  _id: string;
  groupId: string;
  term: string; // Ej: "silla" [7]
  definition: string; // Ej: "chair" [8]
  category: string; // Ej: "Mueble"
}

// --- MOCK SERVICE (Simulación de la conexión al backend) ---
class CardService {
  private mockCards: Card[] = [
    { _id: 'c1', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'silla', definition: 'chair', category: 'Mueble' },
    { _id: 'c2', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'mesa', definition: 'table', category: 'Mueble' },
    { _id: 'c3', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'pizarra', definition: 'blackboard', category: 'Herramienta de Aula' },
    { _id: 'c4', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'ventana', definition: 'window', category: 'Elemento' },
    // Tarjetas de otro grupo (para simular carga dinámica)
    { _id: 'c5', groupId: '668a6f9f8c14d9b7f03a1a11', term: 'armario', definition: 'cupboard', category: 'Mueble' },
  ];

  fetchCardsByGroup(groupId: string): Card[] {
    // Simulación de filtro: Solo devuelve las tarjetas para el groupId
    return this.mockCards.filter(c => c.groupId === groupId);
  }
}

@Component({
  selector: 'app-card-view',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RippleModule],
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css'],
  providers: [CardService]
})
export class CardViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);

  // Estado de las tarjetas
  cards = signal<Card[]>([]);
  currentIndex = signal<number>(0);
  isFlipped = signal<boolean>(false); // Estado para el efecto 3D

  // Tarjeta actual es una Signal computada
  currentCard = computed(() => {
    const cards = this.cards();
    const index = this.currentIndex();
    return cards.length > 0 ? cards[index] : null;
  });

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta para cargar el grupo correcto
    this.route.paramMap.subscribe(params => {
      const groupId = params.get('groupId');
      if (groupId) {
        this.loadCards(groupId);
      }
    });
  }

  loadCards(groupId: string): void {
    const fetchedCards = this.cardService.fetchCardsByGroup(groupId);
    this.cards.set(fetchedCards);
    this.currentIndex.set(0); // Reiniciar al primer elemento
    this.isFlipped.set(false);
  }

  // HOST LISTENER: Captura de eventos de teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.cards().length === 0) return;

    if (event.key === 'ArrowRight') {
      this.nextCard();
      event.preventDefault(); // Opcional: prevenir scroll horizontal
    } else if (event.key === 'ArrowLeft') {
      this.prevCard();
      event.preventDefault();
    } else if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.flipCard();
    }
  }

  flipCard(): void {
    this.isFlipped.update(flipped => !flipped);
  }

  nextCard(): void {
    this.currentIndex.update(index =>
      (index + 1) % this.cards().length // Ciclo infinito: 0, 1, 2, 0, 1...
    );
    this.isFlipped.set(false);
  }

  prevCard(): void {
    this.currentIndex.update(index => {
      const newIndex = index - 1;
      // Ciclo infinito: 2, 1, 0, 2, 1...
      return newIndex < 0 ? this.cards().length - 1 : newIndex;
    });
    this.isFlipped.set(false);
  }

  /**
   * Muestra una tarjeta completamente al azar (no secuencial)
   */
  shuffleCard(): void {
    const length = this.cards().length;
    if (length <= 1) return;

    let newIndex: number;
    do {
      // Generar índice aleatorio (0 hasta length - 1)
      newIndex = Math.floor(Math.random() * length);
    } while (newIndex === this.currentIndex()); // Asegura que sea diferente a la actual

    this.currentIndex.set(newIndex);
    this.isFlipped.set(false);
  }
}

```

--- Archivo: /src/app/components/main/card/card.component.css ---

```css
/* Centrado a pantalla completa */
.card-center {
  min-height: 100dvh; /* usa 100vh si prefieres */
  display: grid;
  place-items: center;
}

html,
body {
  height: 100%;
  margin: 0;
}

/* Tarjeta con efecto flip */
.card {
  margin-inline: auto;
  display: block;
  width: 32vw;
  height: 32vw;
  perspective: 1000px;
  cursor: pointer;
  user-select: none;
  outline: none;
  border: none;
}

.card:focus-visible {
  outline: 3px solid #60a5fa;
  outline-offset: 3px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform;
}

.card.is-flipped .card-inner {
  transform: rotateY(180deg);
}

/* Caras */
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  backface-visibility: hidden;
  overflow: hidden;

  /* Fondo blanco + texto negro */
  background: #fff;
  color: #000;

  /* Simulación de borde degradado */
  border: 12px solid transparent;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(-45deg, var(--brand-800) 0%, var(--brand-300) 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

/* Cara frontal */
.card-front {
  display: block;
  justify-content: center;
}

/* Cara trasera → grid: heading centrado + iconos abajo */
.card-back {
  transform: rotateY(180deg);
  padding: 20px;
  grid-template-rows: 1fr auto;
  justify-items: center;
  text-align: center;
}

.card-back .heading {
  align-self: center;
}

.card-back .subtext,
.card-back .icon-row {
  align-self: end;
  margin-top: 0;
}

/* Quitar pseudo-elementos antiguos */
.card-front::before,
.card-front::after,
.card-back::before,
.card-back::after {
  content: none;
}

/* Texto */
.heading {
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 800;
  text-align: center;
  margin: 0;
  margin-top: 2%;
  height: 10%;
  margin-bottom: 7%;
}
.img {
  height: 70%;
  background-size: cover; /* cubre todo el contenedor */
  background-position: center; /* centrado */
  background-repeat: no-repeat; /* evita mosaico */
  border-radius: 16px;
  width: 95%;
  margin-left: 2.5%;
  margin-top: 5%;
  display: inline-block;
}

.subtext {
  font-size: clamp(14px, 1.4vw, 18px);
  font-weight: 500;
  margin-bottom: 10px;
}

/* Iconos */
.icon-row {
  --accent: var(--primary-color, #3b82f6);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-size: 2rem;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.15s ease, color 0.15s ease,
    box-shadow 0.2s ease, transform 0.12s ease, opacity 0.12s ease;
}

.hover-fill:hover {
  background-color: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
}

.hover-ring {
  position: relative;
}
.hover-ring::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 16px;
  pointer-events: none;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  transition: box-shadow 0.2s ease;
}
.hover-ring:hover::after {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

.action-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25),
    0 0 0 1.5px var(--accent) inset;
}
.action-btn:active {
  transform: translateY(1px);
}

@media (prefers-reduced-motion: reduce) {
  .action-btn {
    transition: none;
  }
  .action-btn:active {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .card {
    width: min(80vw, 360px);
    height: min(80vw, 360px);
  }
}

```

--- Archivo: /src/app/components/main/card/card.component.html ---

```html
<div
  class="card"
  [class.is-flipped]="flipped"
  tabindex="0"
  role="button"
  [attr.aria-pressed]="flipped ? 'true' : 'false'"
  (click)="toggleFlip()"
  (keydown.enter)="toggleFlip()"
  (keydown.space)="toggleFlip(); $event.preventDefault()"
>
  <div class="card-inner">
    <div class="card-front">
      <div class="heading">{{ frontText }}</div>
      <div
        class="img"
        *ngIf="getImg()"
        [style.background-image]="'url(' + getImg() + ')'"
      ></div>
    </div>

    <div class="card-back">
      <div class="heading">{{ backText }}</div>
    </div>
  </div>
</div>

```

--- Archivo: /src/app/components/main/card/card.component.ts ---

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Card } from '../../../api/models';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() card!: Card; // el servidor ya trae english/spanish (o invertidos si reverse=true)

  flipped = false;

  get frontText(): string {
    return this.card?.english ?? '';
  }
  get backText(): string {
    return this.card?.spanish ?? '';
  }

  getImg(): string {
    console.log(this.card);
    console.log(this.card?.imageUrl ?? '');
    return this.card?.imageUrl ?? '';
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }
}

```

--- Archivo: /src/app/components/shared/custom-paginator/custom-paginator.component.css ---

```css
/* Estilos extraídos y adaptados para ser reutilizables */
.navbar {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--ngx-border-color, #e2e8f0); /* Fallback color */
  background: var(--ngx-bg, #fff);
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--ngx-text, #2a2a2a);
}

.nav-btn:hover:not([disabled]) {
  background: var(--ngx-paginator-hover-bg, #eef2f7);
  color: var(--ngx-primary-color, #3366ff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.nav-btn:active:not([disabled]) {
  transform: translateY(1px);
}

.nav-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-chip {
  background: var(--ngx-primary-color, #3366ff);
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}

```

--- Archivo: /src/app/components/shared/custom-paginator/custom-paginator.component.html ---

```html
<div class="navbar">
  <button
    type="button"
    class="nav-btn"
    (click)="goPrev()"
    [disabled]="isFirstPage"
    aria-label="Anterior"
    title="Anterior"
  >
    <i class="pi pi-angle-left"></i>
  </button>

  <div class="nav-info">
    <span class="page-chip">{{ label }} {{ currentPage }} de {{ totalPages }}</span>
  </div>

  <button
    type="button"
    class="nav-btn"
    (click)="goNext()"
    [disabled]="isLastPage"
    aria-label="Siguiente"
    title="Siguiente"
  >
    <i class="pi pi-angle-right"></i>
  </button>
</div>


```

--- Archivo: /src/app/components/shared/custom-paginator/custom-paginator.component.ts ---

```ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  // --- NUEVA PROPIEDAD DE ENTRADA ---
  @Input() label: string = 'Página'; // Asignamos 'Página' como valor por defecto

  @Output() pageChange = new EventEmitter<number>();

  get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  get isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  goPrev(): void {
    if (!this.isFirstPage) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goNext(): void {
    if (!this.isLastPage) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}


```

--- Archivo: /src/app/components/shared/footer/footer.component.css ---

```css
.site-footer {
  background: var(--brand-900);
  color: #fff;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  margin-top: 2rem;

  .footer-content {
    min-height: 64px;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }

  .links {
    display: flex; gap: 1rem; flex-wrap: wrap;

    a {
      color: #E5E7EB; text-decoration: none; font-weight: 500;
      transition: color .2s ease, opacity .2s ease;

      &:hover { color: #fff; opacity: .95; }
    }
  }

  span {
    color: #E5E7EB; font-size: .95rem;
  }

  @media (max-width: 640px) {
    .footer-content { flex-direction: column; align-items: flex-start; padding: .75rem 0; }
    span { align-self: flex-end; width: 100%; text-align: right; }
  }
}

```

--- Archivo: /src/app/components/shared/footer/footer.component.html ---

```html
<footer class="site-footer">
  <div class="container footer-content">
    <nav class="links">
      <!-- <a routerLink="/privacidad">Privacidad</a>
      <a routerLink="/terminos">Términos</a>
      <a routerLink="/contacto">Contacto</a> -->
    </nav>

    <span>© KartanoDevs</span>
  </div>
</footer>

```

--- Archivo: /src/app/components/shared/footer/footer.component.ts ---

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}

```

--- Archivo: /src/app/components/shared/header/header.component.css ---

```css
.site-header {
  background: var(--grad-header);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  backdrop-filter: saturate(140%) blur(6px);

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px; /* un poco más alto para el logo grande */
    gap: 1rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1 1 50%; /* ocupa ~50% del header */
    max-width: 50%;
    text-decoration: none;

    .logo {
      height: 100px; /* logo grande */
      width: auto;
      color: var(--brand-500); /* azul */
      margin-right: 25px ;
    }

    span {
      font-size: 2.25rem; /* texto más grande */
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1 1 auto; /* ocupa el espacio restante */
    justify-content: flex-end;

    a {
      color: #e5e7eb;
      text-decoration: none;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      transition: color 0.2s;

      &:hover {
        color: #fff;
      }
      &.active {
        color: var(--brand-400);
      }

      /* 🔥 Animaciones nuevas */
      position: relative;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%) scaleX(0);
        transform-origin: center;
        width: 100%;
        height: 2px;
        background: var(--brand-400);
        transition: transform 0.3s ease;
      }

      &:hover::after {
        transform: translateX(-50%) scaleX(1);
      }

      &.active::after {
        transform: translateX(-50%) scaleX(1);
      }
    }
  }

  .btn {
    flex-shrink: 0; /* evita que se encoja */
  }

  /* Responsive: en pantallas pequeñas reducimos tamaño */
  @media (max-width: 768px) {
    .header-inner {
      height: 64px;
    }

    .brand {
      flex: 1 1 auto;
      max-width: 100%;

      .logo {
        height: 40px; /* logo más pequeño en móvil */
      }

      span {
        font-size: 1.25rem;
      }
    }

    .hide-sm {
      display: none;
    }
  }
}

```

--- Archivo: /src/app/components/shared/header/header.component.html ---

```html
<header class="site-header">
  <div class="container header-inner">
    <a routerLink="/" class="brand">
      <img src="assets/logo.svg" alt="Logo" class="logo" />
      <span>Alex Galán </span>
    </a>

    <nav class="nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Temas</a>
      <a routerLink="/admin" routerLinkActive="active">Administración</a>
    </nav>

    <!-- CTA opcional -->
    <!-- <a routerLink="/inscripcion" class="btn btn-primary hide-sm">Inscribirme</a> -->
  </div>
</header>

```

--- Archivo: /src/app/components/shared/header/header.component.ts ---

```ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  toggleSidebar() {
    // abrir/cerrar sidebar
  }

  toggleTheme() {
    // cambiar claro/oscuro
  }

  openColorPicker() {
    // abrir selector de colores
  }

  openCalendar() {}
  openMessages() {}
  openProfile() {}
}

```

--- Archivo: /src/app/examples/example1.ts ---

```ts
// ejemplo.component.ts (STANDALONE)
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardsService } from '../api/cards.service';
import { GroupsService } from '../api/groups.service';
import { Card } from '../api/models';

@Component({
  selector: 'app-ejemplo',
  standalone: true,
  imports: [CommonModule, TableModule],   // 👈
  template: `
  <h1>MIAU</h1>
    <p-table [value]="cards">
      <ng-template pTemplate="header">
        <tr><th>English</th><th>Spanish</th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-card>
        <tr><td>{{card.english}}</td><td>{{card.spanish}}</td></tr>
      </ng-template>
    </p-table>
  `
})
export class EjemploComponent implements OnInit {
  debugger:any;
  private cardsApi = inject(CardsService);
  private groupsApi = inject(GroupsService);
  cards: Card[] = [];
  ngOnInit() {
    this.groupsApi.list({ enabled: true }).subscribe(groups => {
      const first = groups[0];
      if (!first) return;
      this.cardsApi.list({ groupId: first._id, page: 1, limit: 20, enabled: true })
        .subscribe(({ data }) => this.cards = data);
    });
  }
}

```

--- Archivo: /src/app/pages/list-cards/list-cards.page.css ---

```css
html, body {
  height: 100%;
  margin: 0;
}

.list-cards-wrapper {
  display: grid;
  gap: 1rem;
}

.loading-box {
  display: grid;
  place-items: center;
  min-height: 8rem;
}

.cards-grid {
  margin-top: .5rem;
}

.empty {
  opacity: .7;
  text-align: center;
}

.paginator-box {
  display: flex;
  justify-content: center;
  margin: .5rem 0 1.5rem;
}

.cards-wrap {
  min-height: 40vh;             /* 👉 ocupa todo el alto de la ventana */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* distribuye arriba/abajo */
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}

.state {
  display: grid;
  place-items: center;
  padding: 2rem 0;
  color: #64748b;
}

.state.empty {
  color: #64748b;
}

/* ===== Navegación con flechas ===== */
.navbar {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: box-shadow .15s ease, transform .06s ease, background .15s ease, color .15s ease;
}

.nav-btn:hover:not([disabled]) {
  background: var(--brand-400);
  color: #fff;
  box-shadow: 0 8px 20px rgba(2,8,23,.06);
}

.nav-btn:active:not([disabled]) {
  transform: translateY(1px);
}

.nav-btn[disabled] {
  opacity: .45;
  cursor: not-allowed;
}

.nav-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.page-chip {
  background: var(--brand-400);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .9rem;
  font-weight: 700;
}

.sep {
  color: #94a3b8;
}

.count {
  color: #334155;
}

/* Botones extra */
.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 12px;
}

.btn {
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.btn:hover {
  background: var(--brand-400);
  color: #fff;
}

/* Dialog imagen */
.image-modal {
  display: grid;
  place-items: center;
  background: #000;
}

.image-modal .image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

.no-image {
  color: #fff;
  padding: 2rem;
}

```

--- Archivo: /src/app/pages/list-cards/list-cards.page.html ---

```html
<section class="cards-wrap">
  <div *ngIf="loading" class="state">
    <p-progressSpinner styleClass="w-3rem h-3rem"></p-progressSpinner>
  </div>

  <p-message *ngIf="!loading && error" severity="error" [text]="error"></p-message>

  <ng-container *ngIf="!loading && !error">
    <ng-container *ngIf="cards.length; else empty">
      <!-- Tarjeta -->
      <app-card
        [card]="cards[0]"
      ></app-card>

      <!-- ===== PAGINADOR ACTUALIZADO CON LA ETIQUETA PERSONALIZADA ===== -->
      <app-custom-paginator
        *ngIf="totalPages > 1"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        (pageChange)="onPageChange($event)"
        [label]="'Tarjeta'"
      ></app-custom-paginator>

      <!-- Controles de consulta -->
      <div class="controls">
        <button type="button" class="btn" (click)="toggleShuffle()">
          {{ shuffle ?  'Shuffle' : 'Shuffle' }}
        </button>
        <button type="button" class="btn" (click)="toggleReverse()">
          {{ reverse ? 'Quitar Reverse' : 'Reverse' }}
        </button>
      </div>
    </ng-container>

    <ng-template #empty>
      <div class="state empty">No hay tarjetas en este grupo.</div>
    </ng-template>
  </ng-container>

  <!-- Modal de imagen -->
  <p-dialog
    [(visible)]="showImage"
    [modal]="true"
    [dismissableMask]="true"
    [draggable]="false"
    [resizable]="false"
    header="Imagen"
    [style]="{ width: 'min(92vw, 780px)' }"
    [contentStyle]="{ padding: '0' }"
    (onHide)="closeImageModal()"
  >
    <div class="image-modal">
      <img
        *ngIf="modalImageUrl; else noimg"
        [src]="modalImageUrl!"
        alt="Imagen de la tarjeta"
        class="image"
      />
      <ng-template #noimg>
        <div class="no-image">No hay imagen disponible</div>
      </ng-template>
    </div>
  </p-dialog>
</section>


```

--- Archivo: /src/app/pages/list-cards/list-cards.page.ts ---

```ts
import { Card } from './../../api/models';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

import {
  BehaviorSubject,
  Subject,
  combineLatest,
  switchMap,
  map,
  catchError,
  of,
  takeUntil,
  fromEvent,
} from 'rxjs';
import { CardsService } from '../../api/cards.service';
import type { PaginationMeta } from './../../api/models';
import { CardComponent } from '../../components/main/card/card.component';
import { CustomPaginatorComponent } from '../../components/shared/custom-paginator/custom-paginator.component';
// --- 1. IMPORTAR EL NUEVO COMPONENTE ---

@Component({
  selector: 'app-list-cards',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    MessageModule,
    DialogModule,
    CardComponent,
    CustomPaginatorComponent
  ],
  templateUrl: './list-cards.page.html',
  styleUrls: ['./list-cards.page.css'],
})
export class ListCardsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private cardsSrv = inject(CardsService);
  private destroy$ = new Subject<void>();

  loading = false;
  error: string | null = null;

  groupId = '';
  cards: Card[] = [];
  meta!: PaginationMeta;

  readonly limit = 1;

  private page$ = new BehaviorSubject<number>(1);
  private shuffle$ = new BehaviorSubject<boolean>(false);
  private reverse$ = new BehaviorSubject<boolean>(false);

  get page() { return this.page$.value; }
  get shuffle() { return this.shuffle$.value; }
  get reverse() { return this.reverse$.value; }

  showImage = false;
  modalImageUrl: string | null = null;

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap.pipe(map((pm) => pm.get('id') ?? '')),
      this.page$,
      this.shuffle$,
      this.reverse$,
    ])
      .pipe(
        switchMap(([id, page, shuffle, reverse]) => {
          this.groupId = id;
          this.loading = true;
          this.error = null;
          return this.cardsSrv
            .list({
              groupId: id,
              enabled: true,
              page,
              limit: this.limit,
              shuffle,
              reverse,
            })
            .pipe(
              catchError((err) => {
                console.error(err);
                this.error = 'No se pudieron cargar las tarjetas.';
                const fallbackMeta: PaginationMeta = {
                  total: 0,
                  page,
                  limit: this.limit,
                  pages: 0,
                };
                return of({ data: [] as Card[], meta: fallbackMeta });
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ data, meta }) => {
        this.cards = data ?? [];
        this.meta = meta ?? {
          total: 0,
          page: this.page,
          limit: this.limit,
          pages: 0,
        };
        this.loading = false;
      });

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (this.loading) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.goPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.goNext();
        }
      });
  }

  get totalRecords(): number { return this.meta?.total ?? 0; }
  get totalPages(): number {
    const t = this.totalRecords;
    return t > 0 ? Math.ceil(t / this.limit) : 0;
  }
  get currentPage(): number { return this.meta?.page ?? this.page; }
  get isFirstPage(): boolean { return this.currentPage <= 1; }
  get isLastPage(): boolean { return this.currentPage >= this.totalPages; }

  // --- 3. NUEVO MÉTODO PARA MANEJAR EL CAMBIO DE PÁGINA ---
  onPageChange(newPage: number): void {
    this.page$.next(newPage);
  }

  // Los métodos goPrev y goNext siguen funcionando para las flechas del teclado
  goPrev() {
    if (this.shuffle) this.shuffle$.next(false);
    if (!this.isFirstPage) this.page$.next(this.currentPage - 1);
  }

  goNext() {
    if (this.shuffle) this.shuffle$.next(false);
    if (!this.isLastPage) this.page$.next(this.currentPage + 1);
  }

  toggleShuffle() {
    this.shuffle$.next(true);
    this.page$.next(1);
  }

  toggleReverse() {
    this.reverse$.next(!this.reverse);
    this.page$.next(1);
  }

  openImageInModal(url?: string | null) {
    if (!url) return;
    this.modalImageUrl = url;
    this.showImage = true;
  }
  closeImageModal() {
    this.showImage = false;
    this.modalImageUrl = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

```

--- Archivo: /src/app/pages/list-groups/list-groups.page.css ---

```css
/* ------------------------------------------------------------------ */
/* 0. SEARCHBAR PROFESIONAL (input + icono + limpiar)                  */
/* ------------------------------------------------------------------ */

.searchbar {
  display: grid;
  gap: .5rem;
  width: 100%;
  margin-bottom: 2rem;
}

.searchbar__label {
  font-size: .875rem;
  font-weight: 600;
  color: var(--text-700);
}

.searchbar__group {
  border-radius: 12px;
  background: var(--surface-0);
  transition: box-shadow .2s ease, transform .12s ease, border-color .2s ease;
  overflow: hidden;
  border: 1px solid var(--search-border);
}

.searchbar__group:focus-within {
  box-shadow:
    0 6px 18px rgba(15, 23, 42, 0.08),
    0 0 0 4px var(--search-focus-ring);
  border-color: var(--brand-300);
  transform: translateY(-1px);
}

.searchbar__icon {
  background: transparent;
  border: 0 !important;
  color: var(--search-icon);
  padding-inline: .9rem;
  display: inline-flex;
  align-items: center;
}

.search-input.p-inputtext,
.search-input {
  width: 90%;
  border: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  color: var(--text-900);
  padding: .9rem 1rem;
  font-size: .95rem;
}

.search-input::placeholder {
  color: var(--search-placeholder);
}

.searchbar__clear.p-button {
  border: 0;
  background: transparent;
  color: var(--search-placeholder);
  padding: 0 .6rem;
  transition: color .15s ease, background .15s ease;
}

.searchbar__clear.p-button:hover {
  background: rgba(96, 165, 250, .10);
  color: var(--brand-600);
}

/* ------------------------------------------------------------------ */
/* 1. LAYOUT Y PANTALLA COMPLETA                                      */
/* ------------------------------------------------------------------ */

.groups-view-fullscreen {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 20px;
  background-color: var(--surface-1);
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-900);
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--surface-2);
  padding-bottom: 10px;
}

/* ------------------------------------------------------------------ */
/* 2. GRILLA DE GRUPOS (5-8 columnas adaptables)                      */
/* ------------------------------------------------------------------ */

.groups-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  padding-top: 10px;
}

.group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  min-height: 120px;
  border: 1px solid var(--surface-2);
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--surface-0);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05);
}

.group-item:hover {
  border-color: var(--brand-300);
  box-shadow: 0 5px 12px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}

.group-content-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.folder-icon {
  font-size: 2.5rem;
  color: var(--text-700);
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease, color 0.3s ease;
}

.pi-folder-open {
  color: var(--brand-500) !important;
}

.group-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.group-description {
  font-size: 0.8rem;
  color: var(--text-700);
  opacity: .9;
  margin: 0;
  margin-top: 2px;
  height: 3.6em;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state-grid {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  border: 1px dashed var(--surface-2);
  border-radius: 8px;
  color: var(--text-700);
  opacity: .8;
  font-size: 1.1rem;
  background-color: var(--surface-0);
}

/* ------------------------------------------------------------------ */
/* 3. ESTADOS VACIO / CARGANDO                                        */
/* ------------------------------------------------------------------ */

.empty-state,
.loading-state {
  text-align: center;
  padding: 40px;
  border: 1px dashed var(--surface-2);
  border-radius: 8px;
  color: var(--text-700);
  opacity: .8;
  font-size: 1.1rem;
  background-color: var(--surface-0);
}


```

--- Archivo: /src/app/pages/list-groups/list-groups.page.html ---

```html
<div class="groups-view-fullscreen p-4">

  <div class="header-content mb-5">
    <h1 class="page-title">Temas de estudio</h1>

    <!-- Buscador -->
    <div class="searchbar">
      <label class="searchbar__label" for="group-search">Buscar</label>
      <div class="p-inputgroup searchbar__group">
        <span class="p-inputgroup-addon searchbar__icon" aria-hidden="true"><i class="pi pi-search"></i></span>
        <input
          id="group-search"
          type="text"
          pInputText
          class="search-input"
          placeholder="Buscar grupos por nombre…"
          [(ngModel)]="searchTerm"
          (input)="filterGroups()"
          autocomplete="off"
        />
        <button
          pButton
          type="button"
          class="p-button-text p-button-rounded p-inputgroup-addon searchbar__clear"
          *ngIf="searchTerm"
          (click)="searchTerm=''; filterGroups()"
          aria-label="Limpiar búsqueda"
          title="Limpiar"
        ><i class="pi pi-times"></i></button>
      </div>
    </div>
  </div>

  <!-- Estado de Carga -->
  <div *ngIf="allGroups.length === 0 && !searchTerm" class="loading-state">
    Cargando grupos...
  </div>

  <!-- Contenedor de la Grilla y Paginador -->
  <ng-container *ngIf="allGroups.length > 0 || searchTerm">
    <div class="groups-grid-container">
      <div *ngFor="let group of paginatedGroups"
          class="group-item p-ripple"
          (click)="selectGroup(group._id)"
          (mouseenter)="onMouseEnter(group._id)"
          (mouseleave)="onMouseLeave()">
        <div class="group-content-grid">
          <i
            [ngClass]="{
              'pi-folder': group._id !== hoveredGroupId,
              'pi-folder-open': group._id === hoveredGroupId
            }"
            class="pi folder-icon"
            [ngStyle]="{'transform': group._id === hoveredGroupId ? 'scale(1.1)' : 'scale(1)'}">
          </i>
          <div class="group-info">
            <span class="group-name">{{ group.name }}</span>
            <p class="group-description">{{ group.description }}</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de Búsqueda sin Resultados -->
      <ng-container *ngIf="filteredGroups.length === 0 && searchTerm">
        <div class="empty-state-grid">
          No se encontraron grupos que coincidan con "{{ searchTerm }}".
        </div>
      </ng-container>
    </div>

    <!-- ===== AQUÍ USAMOS EL NUEVO COMPONENTE PAGINADOR ===== -->
    <app-custom-paginator
      *ngIf="totalPages > 1"
      [currentPage]="currentPage"
      [totalPages]="totalPages"
      (pageChange)="onPageChange($event)"
      [label]="'Página'"
    ></app-custom-paginator>

  </ng-container>
</div>


```

--- Archivo: /src/app/pages/list-groups/list-groups.page.ts ---

```ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Importación del servicio y modelos
import { GroupsService } from '../../api/groups.service';
import { Group } from '../../api/models';

// Módulos PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// --- 1. IMPORTAR EL NUEVO COMPONENTE REUTILIZABLE ---
import { CustomPaginatorComponent } from '../../components/shared/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-list-groups-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    CustomPaginatorComponent // <-- 2. AÑADIR A LOS IMPORTS
  ],
  templateUrl: './list-groups.page.html',
  styleUrls: ['./list-groups.page.css'],
})
export class ListGroupsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  public allGroups: Group[] = [];
  public filteredGroups: Group[] = [];
  public paginatedGroups: Group[] = [];
  public searchTerm: string = '';
  public hoveredGroupId: string | null = null;
  private dataSubscription?: Subscription;

  public rows: number = 10;
  public currentPage: number = 1;

  ngOnInit(): void {
    this.loadGroups();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  loadGroups(): void {
    this.dataSubscription = this.groupsService.list({ enabled: true }).subscribe({
      next: (data: Group[]) => {
        this.allGroups = data;
        this.filterGroups();
      },
      error: (err: any) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }

  filterGroups(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredGroups = this.allGroups;
    } else {
      this.filteredGroups = this.allGroups.filter(group =>
        group.name.toLowerCase().includes(term) ||
        (group.description && group.description.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
    this.updatePaginatedView();
  }

  // --- 3. NUEVO MÉTODO PARA MANEJAR EL CAMBIO DE PÁGINA DESDE EL COMPONENTE HIJO ---
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedView();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredGroups.length / this.rows);
  }

  private updatePaginatedView(): void {
    const startIndex = (this.currentPage - 1) * this.rows;
    const endIndex = startIndex + this.rows;
    this.paginatedGroups = this.filteredGroups.slice(startIndex, endIndex);
  }

  selectGroup(groupId: string): void {
    this.router.navigate(['/list-cards', groupId]);
  }

  onMouseEnter(groupId: string): void {
    this.hoveredGroupId = groupId;
  }

  onMouseLeave(): void {
    this.hoveredGroupId = null;
  }
}


```

--- Archivo: /src/app/services/theme.service.ts ---

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Signal para almacenar el color primario (ej. el azul por defecto de PrimeNG)
  public primaryColor = signal<string>('#42A5F5');

  constructor() {
    // 1. Intentar cargar el color guardado en el navegador (si existe)
    if (typeof localStorage !== 'undefined') {
        const savedColor = localStorage.getItem('appPrimaryColor');
        if (savedColor) {
            this.primaryColor.set(savedColor);
        }
    }

    // 2. Efecto (o suscripción implícita) para aplicar el color
    // Usamos .subscribe() en este contexto de inicialización para aplicar el color inicial.
    this.applyColor(this.primaryColor());
  }

  /**
   * Aplica el color primario a las variables CSS globales para que los temas de PrimeNG
   * y los estilos personalizados lo reconozcan.
   * @param color Valor hexadecimal del color.
   */
  private applyColor(color: string): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', color);
      // Opcional: Si está usando PrimeNG con un preset de tema (e.g., Aura/Lara) que
      // requiere una paleta más profunda, podría necesitar regenerar o simular tonos.
      // Aquí usamos el color principal y asumimos que el tema base de PrimeNG usa esta variable.
      document.documentElement.style.setProperty('--primary-500', color);
    }
  }

  /**
   * Método público para cambiar y guardar el color primario.
   */
  setPrimaryColor(color: string): void {
    this.primaryColor.set(color);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('appPrimaryColor', color);
    }
  }
}

```

--- Archivo: /src/app/topics/topics.component.css ---

```css

```

--- Archivo: /src/app/topics/topics.component.html ---

```html
<p>topics works!</p>

```

--- Archivo: /src/app/topics/topics.component.spec.ts ---

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsComponent } from './topics.component';

describe('TopicsComponent', () => {
  let component: TopicsComponent;
  let fixture: ComponentFixture<TopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

```

--- Archivo: /src/app/topics/topics.component.ts ---

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-topics',
  imports: [],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css'
})
export class TopicsComponent {

}

```

--- Archivo: /src/assets/logo.png ---

```png
�PNG

   
IHDR         �x��   IDATx�]�\��>��JI �(5���?-RJ�@�;$�Sܝ� ���P�^J]�:Z�-	� ������wg���nv�����r�;z��o���I$v��!`�@�!`��r�!`��! b �
C�0�D�6 58��eC�0��F���
 Q02C�0j� �؀[w
C�0j�����q��!`��!PS�����:k��!P����  a�0C��!lPC�m]5C��u��o�6,L2C�0j� ��P[G
C�0j�t�m�F�dC�0C�F�
@��u�0C��(�m 
�0�0C��	lP�l�4C��u��o�bDL7C�0j � �� [
C�0j����
@{L�b��!`T=���!���!`�:��o�R���0C��rlP�l�3C��uJ��6 �q1�!`��!P������:g��!P�t�� t���
C�0�*F�6 U<��5C�0�ZG�����cl�c��!`T-��ڡ����!`�:���6 ��c>C�0C�J�
@��u�0C���������!`U��m �rX�S��!`�����o��!d~C�0C�
�
@�u�0C��X|�m�x�,�0C��:lPuCj2C��u��� t%�1C�0�� TـZwC�0j����6 ]�ɢC�0��B�6 U5��C�0�ZG����
@W��8C�0C���
@
�u�0C���z�m�u�,�0C��lP5Ci1C��u��� t-�5C�0�� T�@Z7C�0j����6 ��ˢ
C�0��@�6 U1��	C�0�ZG����
@w�xC�0C�
�
@�u�0C���~�m�}�,�!`��!���
@�B�!`�@�#�$��
���fyC�0�~��m �� Z�
C�0j�%�m �7�e��!`�klЯ��o��!P�,i�m���Y>C�0C�#`�~<x�tC�0�ZG`��o�%��r��!`�� �ۡ����!`�:K�� ,
z��0C������5�0C��X���`��܆�!`�@�D�6 �rجц�!`������6 K���7C�0�!�臃fM6C��u����Xz�C�0C��!`�~7d�`C�0�ZG���
@9P�2C�0�~��m �ـYs
C�0j����6 ���J1C�0���W�e�5C��u��� �I+�0C��G��
�5�0C��(_�mP>,�$C�0C�� `�~3T�PC�0�ZG����
@9Ѵ�C�0�~��m ��@Y3
C�0j����6 ���J3C�0����d�4C��u��� �Q+�0C�����5�0C��(�mP~L�DC�0C��#`�>?D�@C�0�ZG���
@%P�2
C�0�>��m �� Y�C�0j����6 ���J5C�0�4����c�3C��u*�� T
Y+�0C������5�0C���\�mP9l�dC�0C��"`�>;4�0C�0�ZG����
@%ѵ�
C�0�>��m ���X�C�0j����6 ���J7C�0�$���b�2C��u*�� Ta+�0C�����5�0C���|�mPy��C�0C��!`�>7$� C�0�ZG�'�o��@��0C�0���cb�1C��uz������C�0C�O!`�>5�C�0�ZG���o��B��1C�0���C�aM1C��uz����9��&C�0C�� `�>3�C�0�ZG�'�o��D��2C�0���#a�0C��uz����Y��6C�0C�O `�>1�C�0�ZG���o��F��3C�0� ���`M0C��uz����y̭FC�0C���
@��5�0C������7P�:{�3�8�}��wo��[s�5��Q�݈�#ܰ��WXѭ84!� �I�W憯8�p7b؈BB9,k�𑮍Fx��<%��Cy�P�g]�PWG{|;����6�n��y����
C
-��[��V���nh���z�p��ظ��Iٱ}��C�C��,�<����������'��'�8�AC_��u�)��P�h�!nHüq�q{�z�P�~~i�1�o��H�﨑��hШ��s8�#�"#�w���7n��8q����`�@�6 %@1S�!0u�T��vۻe����ջ�/�X~�G�矕7�|S>���9s����#�����	Q�������#���,P�dƬ��f&|�aY�m���3|���gΚ%�@�I�P�o�����|�|���q�?�8�c��#і���=[fϙ�М�S�+�gϑ�A䤏K}�\�3gNͅ>w�̙[ZF��>�|��|��F�lĒ��C�y��9dؽ�����?�\��h'́m|�Cf�&g���꟝o�������砌9�g'����,`<��	�s<b�)3g͐1�|����`�2:�	^3,�c`=���{A��n�0a?Pn�2���;�l��aT�@喝�ܭ�B`̘1��o�}�����w�	&���iͶJsK��\N����s�'4�s�Eu�NJ�A�
% 8�a�Ӝx���bKB�>�<�8恅��b�>�H�A��},8dZDQ<���
8�ƔC[I�?��2J��=�i����.��w�DB�C�2�
�����ѧDg�����B��/J���|B~�é#�Ў�Q�qi��PVG;iq���2��O>��z��[y����/�Rq�`dT� TU+����.��e�]�=����p�BQU?�SyQ��4L�	'$��"��cJ�/��qid��Z2��R�|��w��y(��?p�%���+e�M�\�`Dj�%�yg2
�q�E���_����{'=�'N��g�.��������;��`�@���h��B����|�8p���O���fi�]~SK�pα����H�UQ(�4��T����餂r����I�;"��.�*+�:U�'�DN���>9y������-�ܢ��I&c�@��
@�1�{	�o|���I%����757����2��$�i���bsm����
iJ����m<��G��'�ؐ?����������<<l:ޖ�9�~j�J.������4ld��2�)z���{�r��(n��{��'��i�4�?ʨ(�(���?f\>.Fe.��dSn��Ҟp��I��!�� �.���
,5�|�Wp�� @
i��E%��}� -x��C �\�V�!�3���j��W^�E��j�W���~G�0�s8�j
M����]\�H�D�t�'��]E"�q��>�o��ÀS&�|���������Ș�������`T��f��ެ��6�����Jss�/*�;~�L	��[N�x�Oj����k?h��;��y[��d���'��\�d��K�Jh�R5x���]B�F`�E2h�@�}���dT����[�@��y��^|^���ş+~.�E/[������?��D�����I8TUD#�ꥡ�Q o 5J}C���7PCc��5�3v &��3`�@�Ӡ6v����|
�����7���^�y]Jo`|]�ogx=|䴓סOuގr�%�a����?���:���
�Prx��v646`�,�.��,���2x�2��2���A��}��A2 8oO�1�~��۴m 0o����m�8&�ȀT����   IDAT���e
@,���ڒ2�4�v�/��~��֑���کtU�GĻ��@�H��-��H.�A����>;U+��/� �.�V�"p�u׻��ɶ��K�܉�?VUrNT�m�hFd�Q������ﻏA�;/崵�E�A�-o5iKs���4PsS��a��c.\���gѢ�J9�m2���1(;��܌rA��qy^o	�ż5�{?��v�Z�#����������mjѻ�Wh[k��E��]J�10�ɜ�	�~�߄?���d�'�t���:o�\�t�'��'�u��`᧺p�`�����ij�ql�M��q�z�1�LN���_L�t�aL�&_�"_e�9�q�'cN;۷�A�&�)�d���vZp}��iӦə?�����jO}.H�AL��$9>��">](�-�����"h42ʏ�m ʏ���w�	���<*S�,���q�$��JC}^���'�"o����xӍ��wW�i��v��[o���O���oBRa"��ŎId�
6Hb���7N�=�<}�7u��񒕜�E�& ]W*PE���V����e;U'�ݫ�J��VX��@7�{�wcҚk�sa���bgN�d���m�]��/�C
����^�-V2l��@F�nD�cÑ��	���F�k+]}�5z���p�f%�S�K�`� ���jg��7#z����G�����*1ʃ�]w��'Ⱦ0���	�)'TR���ɧ��r֎�wѽ�[�[�&��@P�cG��u ��C?\�_~9q���K�������O=�T��S+���~�����Z�
�:�(7�q��{b��;���e孷��� �i��ʩ5Q�B�i{����O�ٞ{�Ѿж�n���9��'�ŵf}ժ�! De� ;�����͒!P>lP>,��@����i����a���eοsq�>/��9b��2�&h�f6�!�E� _�'��U�ʶ�n�k�=���Ⲋ��14J�����U"�&x8�O�h4��B7l�F���ef}4K�;J2��չ\N>�3G�:��`����U��p���zHH���#uk�z��=^���簐����w��� �n�S�����=�.y��HO��̞#v�F�6 �F�ʫ�_p����aB�u��x
���[[[Z�9��W^y�l���71���j;s��;}J��ւ��65JS�Lq+殸�*���,�J����p-
�@U<�����$�<@�j$��zJ�^�RsG��m ��8X+���c�>&����]�g���*����� x- 80	777�F��3�

��	GW��ڳ �R��"���H��-1�M�Vi�7v�r�̟3Op�IKkk�U�����:t��ؓ�|�H��d2�?�%�3ʃ�m ʃ������K��o	����l�pU9���j�d�4��5'�'_++[�]?�L�>�
N=�bI��v�hW'���k�}�u�����A�k�ͭ͒�u������	����8C���q�,�����T
��>D}�!�C`q|���'P�H����&@0�(�ds�Ҋ���9s�ȣ����n�=����^��N�&�xdߒ����(�5����E��>o���p�e��*�b�0O�˸!PlP��A`Ѣ���RՊٕ	k(��hy���˯��v�qDP���@�
S�~Ô�'%��T4�U��?����ZO�����~xܯ����;.\�R8��'v�#

e��#���Ҍ K����� �����,��/��ZL����ˊQ�a�(a��,܌�Vq�����\66��O;��0��� T�%�L���[�Z�E�G��˛9��}��dp�4����]����J$���T��!�^�±f���r `�r�he�mv���L�ՊS�/9Rܐ�wn���K/�LF��n��V���p��3�$r%��9i@O������N.SW��������9�"|L/~�V0��]�v=1i����p���
�˨�"ЗZn��4֖^E�O�h�<[D�O��� �u欏��C�/|�sa���~p�tm����A��,ysW�������{���z��������#---I�7^�U�R��C�h�W!(gK�@Y�
@Y���/���ϵN�A�� 8��Jk��3�>�;�:��.�8��29~��,
$.���b[��!$�mI�Ņ%����3N?�-7dyw����^�Ca�WU��H���bN�� �H�	@;����� ������x�L���� gu��� �����
����㙡�Z�Y�K���O�������N�t�l)9D��x
1}�O�r�6l�;���e�'�J�e�O��l�H�S(.b���[2rq�B&�C����-�V�!P1�ɱb���]@��#��t�f�tѨN&_7YV\a����I=�26�S��Ӏ��m�3�=��DNXqN걋��%R�N��9T�͝'����Ύ@V����;l�ס$VW�2���F���o��6"֞���wv9>Rg�$�2��@k6'��ϗ�?ZV[m�xֆ�/��{�YW@	���@F���&A�i��nŞ�����d�H�W!��~#�
!���v yLT�+���
@M�u��pF&)r��ZZZ%�����M���,�"�N���J�h'�F?e��P�;�D�F̞{�q��z���OJ}�N�Z����7F��C`��z$%ui�Tf�T��W�m �ޘX����Ih�&��mpU�����R_�qǌ?:�@P/��7 -+�&�<M�t�a)w�J	��)�Qթ|=)v��n���{�OyZs-�_�p�/OU4�F��?�P�ơ*��/��JVee��k�X0a�Q����i�˻F�#2i���n���
��;������+VtLH�b;�'�LX�Y�s����=�
<��8e��V��~�u�Z�{�'|��z�#�{6k�"��a��Ͳ6���&(>J9UL�H�l���2c�,9��e�
7��S�_G
*C��zG�a���b��c�6
9��X����v�=z�;��I���a��_��r8~��'����Z����6@d����� ��*P�i�.�?���0�������������N/<�O�-�t��tL��'�K��ʊ\!��"����z����_�~<O"���	�]�3��\�ݓT����䩚h�j������-�����6k�!���O�Iӱ�P�������/4��N>�8�ae%]���r���b��-�2��l=#}c�o�V��+�J]&#�Hw��H� �hJ��~T�*&H�pB��v'ĵ���X:p�/]���3t8y�B�|��w�l5s�in��%�]�0�i!�!e%�%���X\XM/aΛ0Fɞ�����cǎs����,�

���,�x=����44G�7=yן�*[@J�L�6�j���0k�!�m�L�sV4C����!��9~? '}4[�?`_�h��|?��B�4������w�K�',�)�/�%�2�s�=�
0�M�>M���JSs�Ę�hD�f�?�
z���zqhH�H
�qC����� [�@��ɝ6ؚ��K/���q?�y���|�%w��3v���(v5�������U�U���=���VYeUw��g�W�,�?�`�WQ�NW~HLi�z�ڴ��b�e���@�m�m ���X��\\���$��4��S��zD66��=�,s�jRAA��-��b��ŢH�����rSko:�R˟��ܞ{�!3>�Pw���P,pPEQ1_���K	m(��H/R��Hb�!PlPP��ZE��U�<B���ceQs�\}�52b�p7y�u����3g�LA���+0�G���I���2����(�?�e�����=�����*�RU�S��#�R�
����E�j"���ڿ�˭�
@_k[�#�Q<ë�E>��wf̜)�:B������.��/����$A�0�Ob y �	��D̳��� ��5�K�,K*|��;�(����1i���/��d[|qE~�'�"��^9J�6$�r6��
��*���Xq��   IDATz�Yg�˱�F�h�����U�ã�xQ�I�^��]o�����e�v�mK�j��B���mR�u�'e$,��:�E)$V�q�ҳ#�8���Uɣ����i�ds���/���^A�?�p��L��5��<!2Z��"UUMYL�_�����o����$ݙ�+ҽh)��;=��VUQU�Ixd�Y��l�
�r�H�����Ռ�=��2/�lI�4�+y3$A���t�!�Ʈ��g��/;�M�n��9��K��O�T���:PU��Gj^*��|�5�� �H���C������Y�^G�3"�TC�8c(��e��Q��Q��B݋��G�$.����s.�3�D�������ܙg��ئ��~�,�'�R�$r(���k�"a5��]I�by���ۍ=ʝ}�Y�mʢ/*���|FU�9�p	y��Rm^��ř�	Z,���N�4�%����vi*����@_o�m ��Y��� 'KfIsʤĞ~DMS�)��������?'�
B>�l.���VY��I.��<Y~�r�܊G��Y��(�R�%y� A�'�L�B�d�Mܘ1cd�G�E����E���/��p��RH�DS-�{� ^q7;�4�!���`ɱ���� gERG�����c�+H�_���D�e��js"�M�?���ٜ����.�m���X)�)�O?]��JZ�������Qv�@�,�����QI���k/'x����^��������E�( g�?��C,5]R������`''�xr�H�*����_�n�ahԼ$v�'�~[m����ZX��bz��O��x�<�a�$'%�%Yڟ�KWֈ���Ȋ>��(R�2*<5�
�������9�lG!P+�.��3GX\���<΍�(��U�R�y�­9E���n8,���q�嗻��Fw�=�ʠƁ���$�-�>Z��3��rR���*Q��XR�������RR�alZ�F�h˧R1t�b�L]ME�N���:LH���9���#�OQ�˴
��!O�X��"B
Ua�D� b�K
29��@�A���Y$)Jz�@;�$Ǖ��߸q|���D���W�k���z9�sd�-����O� �hz�ҜX�e䫠�P�R��������Ϭ��;��$�H��c�B<�@�j�P����	 *�b�͑��e1�3�(��Y�tP�S`�ґ�v�� 
8���F�o��#�C��|�}SE�p��3�~���@h�m ��(YPU̓�t1�c��W�hP��$Z)��"�h��0�"��D#	bA
6�@K����Y��h�	���]LS���g�h�L255�����'�.
�u�1�\�es�2՟\ҢBX)1c|I�j��B��U�(����������}���~ <.ZHb=1qS ���pj�"�c��y����ͅ�ίJM���?�1� +��75��xt��(3�E�\�gTL�abTU��`N�\.+��˙V�A�a���.�I
���g�S!D}�(�DΒ�$ʁh+&t�7��އ`�B|jm�J]&��̙+��˯(���8k�BR6���H�5ԭ����hl�s�=W&M�$
�:Yğ�M�Ō�Ĕ�B#����ո�T"�-*a�o>����Fn��W<-Q`�.K[�����
�3f�h����������I>�;a�;JN��3E��d2B���*9����liGҷ��X�[�^$rh�f�/�q��O���B��SZ& �<���Xr�LF��v��Z?n�)����_�kZ�,�5F�Շ��	/5|������G����
��0�z����!��^�
���J#�9RTk�
>�$��3Q$+*_�|K�f�m�{����`��.��*�ﺛ����w�]w�
���{��c���{��q{��}��#���W��w?������8P:� 9�����C��;L�8�9��#e���r�	r��G˱�#�{��p��r"�c�|�Ir��'˩��"��zjB��i��2����ƞt�>�?�8_��(�u�.�y���!��(�tڸ��3n���n���}W����d��7���V�(���F�$�?4ґ��>c(3d$�јR�pU����A�`�����M>'���wd�]w�=�#{����]v�Uv�yO�b���}��d�0v{����^{#����ʘ@^Ol{����|ܘ=��������1�g�1{�^{�%{ｷ����Ƃ�������?W�3��zƌ���;vo\S�b���a�:�@�w�}d�����(o�m������M����y�_{�&V"EX�}���6� ����v�`A�9)|�Ւ8?r���o���퉿飏>�?��#���?���O��^���{�����w�}��yם:���:m�4�:m��1��������o�[o�Uo���������o��ܨ��p�^w�uz���:q�$�f�D���k�����+��J/��
������K/Ջ/�D/��b���P/�8�i���0���.����tŕW�2�A٬�u��믿A��t�s�N��f��6�{:�w�����?��/��3���Y�6�l'����3������N
6�i�=��y�#��X�œ��44���eIsS���h������~�K?>��{��u�]z�����z��?~ ��W��n��n�[2v�ǻ`��{��1�I^Olwa��Bٴ�}�b�1y��|���K��.��N��i�N����κ�D��{B�����y�O���3\G7�n�Yo���㎩z�m���{�:t�$�'!�����j$��0�,v�F *w�V�!PQ8�(f�QY���$2d�!��Id���<���b;����p.R,�Ey�	�`��o�1nH���9�|s[z�
(Q&�L���� �	�I����@�i�m ��XYK� g°�`᝭�{�,�y�� d��7�"|R"]>0�8C�`��'R�7%�VF�0f���UFA�(A`�e�~wCU%��7"��0��C����̀Zq=� �¦���x	 �.S'������ލ�}/��.�{�����]w������N;��v��Nn��������|�{��om�����v�m�����۹o~c�����o����
�[m���կ{��+_s_�r+��_u[n���f[z���[8�f�n�<}is��/m�6�����/��n��� �y�@Y,��e󯺯���P'��h��_���?�5��+�}�}�K_v_���6��;��S�1Z�Q	KO��[~��(���f1^��ĦNn�m�l�����|�m���з���2�[n�U���[�-�����f�͡o�6�X����q`>��V_����W��}}��sćc�
��71��|c[?��@�a���f;�9d�l�����ol�M��[��Ⲙg�m�徵ݷ�u��o�}����v���yǝ�v��|g�S����]�m\w;@�}�=��/�"���3�ͭ*�q�f�/�O��
@-k����$�
Ip���0Y���k�w�r�}w���'<x�<���假����<�Ӈ�'?{D~���/~�3�������_ʣ��J~��G���F~��������'��������������Y���_�o�'�*�?�7y��==��'���?�O�|R��ϧ�)�������_�t@��c��ɿ?)O>��<��㾎ǟ������/�����@��(l�ߞ�����������sO˼����O7�,�L\�II\��?\�0ft��Z�Ӆ�������}C����<,���_�o�O�?O��	�;px*����OA�c�7y�ɿz���/������I���?ʟ��G�����c�;��o��_�q��`���o�sȌ��Ɠ~���	��e��<�>�k��o~寣_����s\W$^c��ay�'��G<H	�߯!��u�S������d� ��~[%���*�s gK�@Y�
@Y��*��_sp��όq���JL�x6�'�8����C��������/?�����NN�繜�C�,*��Q�JO��X�T�B;������o�O>.��Yoz   IDATlި��$�[�PRL��W
]
��~�<\�s�
��{����������mп��Z�'F�P������g��F��'ع8��$�۹�#p�Gj+P�̵(�$Ƅ�D�E4��F�6 ؊//~B,o�U\Z�������}����_�:�����XQ����5)�X�G.�&a觝�oͶ
@�o�-ݹ �t����I�X)Qc���K�ms@΀���34�m�(�˫L�Y1�@E�i�
^,mJY�r�\�V���}�0��g hDC8���i��7f5�b̈5�@�~��h�a����V�w��o�xt�/R_�E�#`���1o�C@�\���A��|�����Nޙ�~��$O J;���M�
@5k�!PʵX����W��5Qh=BY=�N�4��iĭ>C�O#P��F�G��*�O�V�����V�+�\��rl�?ǭ�[mJ����l]k����Z�U����b�U�k�`"`�۪*~V,GAVFI�/�@A/l�J!@�}�y�kv���V����\Ͷ�Suw���|�\
_�;¼T|���b��D�i�
��׌�@Y�
@Y`�Bz���z���[6Ysߴ\cI���8�Hi[��]�wqt��՟z���/��m��;v�rC�������Y���^􃭳|��K��I��AV"�7��Ps]C�6 ]�ɢ�6!�gH���K�+O�P$3���N�JL�L�a(��?�lX�~��scmПG��۾�ũ��)�y.,ib��p��q� ����?�|I�f�%�ۇ��%Ol�m�.��Ɖ�F�@��
@�1�}��I�rM
�T���)���B^����Bg���J���DO��3?9I��B�����:kXg~�1,���uV��*�@�.�6 �{���eG�-��Ǔ0���q�tD���-��$��a�H��9e��ve�HA&�A/��~�Bl��z�C=P��=/��>��,lYG���ڪ}tc�g��#`��>���2"�IY�I;��*���ObL�b=ؗ���eݝ���<�����������H�:mi*�S'�c�����CN_�!/9�����3}���H��EJm��m�I}	���� ��������ғf{X�y�{��^���r�KrP&Qe)贑�uںC�_L���-p��Ķ[Z��Y)�P�`z9x�|��Ri�3�C���ɻK!w�1�+yCb�ș/t��
�s�(:� �S>0o1�('�('�VV!&��	���C��b�OS:�v��i��Dy�b=ػʙ��xr�4[�i_)9�U�x��R6ƓJ��Ɔ2����=Yh�;
A��m0w���ӀN�]ɻ�6�T\K;��W��1�Sz�o�m ���h8ɒ����).=���ʟ��?��T��+�m!6�K�ڝ�ڱ��D!�#����P c��<�8��2��$4�}M�ʦ{�v�^�)-Cm�\>k{�Y��G�6 K���Ы,v�B�PR<�R@.H�<�ؙ(�qB�v��Oi{Zn�e�dQ�X?e���SQA%�;p�ib|����tꥈY���y�ɋ�K^�-���̝�vet�@R	Is)#l�A�m
E��.s��`�a��:� T�(�t�+OW�+9Iğb�'k�H�i*����ӱAy����QE����!p��>)u�6�#��L���(m/�YM]eXW�E�ű��2����z�����+B�����s��|D�T�L��9d&/#���=�D�V�!@l@��~&N�L9�1�H���'�y�����*V��X.D	�<���H�8#B�4�~���q�AC����+
q�Y@��<-�c(wB��NBҮN^�K;���K�����퇞����r��Ġ���p%/c�0�W����A)
1)S�� �B[��/�3����mP�Xc�c�ۜ$S�I>�N쥲�c� �����
փr�k�|�C&�<T���#p�z:�Q��r:CZ�΢�#1�<��-P�NSJ]����K�a)�+��>Vy?*�˲d�@F�jABR�)֙'�ڟ�Cjo7�!�s��簶�ʊ@�u�K̤4���vR)_�b�]��j�����ɋ�}�BK�n� �C��-c�d�;*�;�N�L�9̲̓HAGU��$�.�R�C�%�����A�so�'�^@���S:�@���.?�}	~()��7F��|t�F^��#�������*�Ne����mP-#Y��$'IR͝Q�!��y�e~f��D�D��Y'�p
2yB,+�	�]K(#��<�)�ܒm@��{dϑ�bI���� ��cRr:� o���|n���!�$�Oކ��!���,�r�0.���p��	F���
<��#��P����R{۟�ޚ��6�{J&�ɒ!PFlPF0���B�dB	�-I͙4{[r�눡LJ\���3>��"���/�SN�ROHaW�wFp#J�Ql���R��6$2T�h+�ӥ�F���T�|���r-af�XU��l���,8|7��hK�)9D )J�I �����6��"�OL��`Hˉ-U�oEbc0�-���	��������� � ?���q��Y3�9wJ�#oF� C�)����sک$D��ռ����
ƠάAN��goL6�b�{���D��� �wWg����&�J0b�/�����X��&�h�jщ��)���||����eƦ�ƠS.����`�TW��a,1�Xb�,c� ��E���������gNq
�`V���L���'�y����S��˄�DS!%F2R�3�B[pp���$�0��G�D�r��-�5>OR
�\�)����6�$��1������I7�Ѝ�CC9�$��^L�y4�`!�{G�>ڃ�;�"i_B����	�k�R�A��Zb�j�Z�'F�&sʘ��$2�£��'��uY�E䦞��L�(�N��v(�$0��2
�I�I��uʤا���6���z�R�3} �/x�1��-����QE�O�� �h���8�6r��-��4����z�ɽ!��^'�%T_W��#-C�'ڹ�C6���Q��(8Q����)�A�6 ���J�AxW�#N���'I�ӹ�D��hO��q�nI����0�s��
R)[`]�����ؚ|~�!.7��Py��F�8�@���L�EL�G���h���8R���6Q�ȝ�b�ȝ��}�E�/Ŋ3'.b�;�u�����e�@�@;	T\h���N�y[:ˈ��r��T�����y�D$��E��(�P Y^�ږhm�L�-��^� T�x�DoT5^��ĉI?,��~r�L��)��
N/����g`p�I�Ӝr1I�.�(Em19đ\R��#z���C����r���MDRZ (�I�;
����`�����!�ԙ���o���S�\h���
7F/��0�'$�	�f�r$'�J�(,�/Od�VH�CK�i�Al��P��R <b���ht���r	l��
3�!�=��[�!Лē��1A��D�4ED#UN��+��H�A��?����8��wlC�}݋+��_��n���e��
�
��7R�~�D �8������ĺ�6/����$X}�H��w����F�Nة����c�#��|���%_��\pt^V�<K�꺑r賓r��*�He�&y�N��@��U[��?Ջ���;GQ��'h�l6?i��-Wb��=nׅ`Lu6��x{�?!K�	� ��r�/��Ȕ�2)e�UU�U$�;�L�N��g��yk
�b8|ǽHX��E��6��u�a�v2ʌ�]ZeԊ��Cl+�>�",(Q	IUe�-��3t�\zɥr�����k'�����u�I����'�հ_u�Ur�W%�5r�UW�5�L�I��]�|�]��pÍr�Sdʔ)r��7{�9�[nʁnI�7�t�L!!ߍ7���n������:���znB=7��(��[o�[o�Mn���:u�L�>]��.���6�6m�L�6Un�z��~���v\xх2p����d� K���_q���r��0�O�(A��c�Ξ=   IDAT3
�#���a¢/i$9�u�]��sϕK.�c3Q8f�0F�]wp�Q��M7����~�[n&���g��r��o����;�;�&t�x��U��4!�6m��S�N���y���y�)��T�C��;}�i�?M��N��yם�	��w�-��{��w�}±��X���o���&ʤk'ɨ�FI]]��j<R���)���T_�Q�u�zT�p��}���W�s�����z9��C����ѓN>I�>�h=�#��#��4~�Q:a�x=�c�=V�;��D>Z�=�=��	:~�Qʸ���������C=D9�=���<��*�@��>X!!ߡ��2b:���PfB�b�8��CP���Byp�����߾��>���Ǝս��K��F�ƍ�}���������~�v�v�i:z�H��"*���E�����DG���D�&ʤ�\4�e��r�!s�W�Q�N�444�>���q��|�I�	~��c��8���=���|��/�q���$�߾����t߄��~��x�LH�����qJ>n�X���g0L�$�xS�'��9y��F�X�	�{�������	��1ct�=���w�ݏ�X���=��t�x\wG��Q�GJOF������[b�
���!`��ai%U?	r���
'Ȉ�lk�l v�d�9�Q0P��&w��S'�1����@���SHr�,I<�	����_`onjM���V�K�5M=�<Vč�^E�+�
@5�j��	7D虊_p����0K�p��h$��<Zv�\z��1s�� 8�* �K�u/t����]��(�k�H��N?�4wÍ�c�[L95���~^�|��F3�R12*��m * �Y����\pR�a��*�
�Ip��N9M6�d��F�s_����?�/o��&n��7r믷!h������]߭��zn���u�]{Ok���[k͵ݚ�Y+O�YcM���q��FZ��n�UW�e���1૯����h�UVs����[i���J�Wr�G��F��F��p�1�1�
1�
>�
6�ӈ�#��Vt���
���끄_��<S����.��L��q�wO�1*�E���Bi#%v�y�Tr.+�O'����	����:�����n���n��G?W 6��ʫ�
�Ws�o�1]s͵���gV_�
o�L�16���1d�Ϭ����2��5>밭Y@k�5��3k:�՞`g����k��p
��k�k}�|\g�|���gQޚh����r��zz��W%J.d��`Hxr����Ys<;Tg߬WU� �Cv
�S�`
�aAiii���y[�~�iy���ʿ��/�����g�{Z�{�Yy�ρ��^|^�����K���^yQ^~�%O�������+������7^�7�|]�|��8��7䭷ߌe���1�o�?��@o�������{��{�'��|�����'�rL3f|(3g̐����5k��f|�����#�;g�̞=[|�@ZZZFe[�|q�Me�ܹ���C����q!aq(=N()���`�y<d̨X�U�x��ٵ֑�mkim�ʀ��PʢEe������2c�Ly���䝷��%o&���ګ�ƅ������q�Xgb��x<^����7^ϑ�y_��Xgy����XO����Xg��<i��_�Wq
��k��W_Ƶ	��K/�Z{彆6�!��/�WSK��M- TM�fnH�Y2ʍ@r���X+���B�/ \,��R%��en����j��?���"^�B�<�ˠu��잷Ւ/�&�S\�z����. E������'�=�k�]'}����j��L}���Z�#'�('��E��X	�*"`_��&�������Kv�����T�ݳ~U#� I◕j�a�����ˮ�0���׏��Y����T��ݩ�x5*ұ�燆�$n,i�T��m�1��ϙ�s�.��|}�7�C�^{mol�S��EN��.��T��qQ<���nU���O��[�O/#`�^ ����<��a̘1X(�>���X%bs���#��^9 9)�
�/�h[��z^��q#.��f��SЋ/��}ҡC�H�I#69lfrx��,�t�������/ 8��O�^�/��vVowJ����ֳ~� '�~߉�v����s~�i�i������w�]QPn}C��SJ)�T��bQ�`9T�٢ENl�ƹ���3��K.��3ueT��ܡn�s��\��g�� 8�Uӣ~6 ���dJ���Z/�?U?*���
�?d$Ż�(�������y�aD���!���c�ŌFQ+�h�_��@hz}}C;�'�x��4��w��=Ĩ4�����UQ"�6��@!UKo�u?���Q5w��V}h�u��G\SI���gp��g��]oV}���wvr�"|�+��`4��&���� $�T�� ���F,�y�s�GQ���+�$�F2h`��O���!u^�y
C � f��j�!`�.xKT3��,7T��n����к_R.�"w?ks`�E��)�����-�h�bMw06�5E����|�M����d�r�J&�$���i���u$�+�]Lur�{�j�w��oCOܥۨ�C� ��Hd<��d�G��#��������%��k9�Ŧ��>e	��Y�
�B�# hqJ�ǖ��=�0���L=���%�,�� �%C��:Q�C-��}��~K�ӂ�����^@���wY�^q��K�62���/u!���N��ݯ�-m��Ή戧�]5����(_;i��lN�������Q��2�9���²zZm'h=]������m �}����@�����{���d�UW�����/��,�I��ۗ��������0��Gۨ�vȈ����{mij�u�[OT#l���.���"=s�����=S��R;��vƺ*zZ���,�'۴dr�	�2�7�6N�m����}�K����3�Yi�U��k'˫����.o*���/UE�
����*H��(*��ܳ��M7O���(�L������6A�*���o��_�v�������W�xY{�0����hI,�<P��Y9��`#qe��Z2ƉDT/.`w�RxTI.����O���yG;�P�J���b�Qe(�<�����	mBJ�_<������?ԋ.�P�d�x�O^T�f�*<u`.����Ɖ��ŵP�%;�F �T��T+��:\4!s!	��l�PUQ,:\���q࡙ضӎ;C��⋔B��u�V��T�S�$8��������{�~>�ē��y����GI�PWW'�:nT���&a��g^8�޼��!�����s�BM���Q��>bҮxw8ג
*����Xq��|/*&j6ѹ��;~�(�E`�p�
iӇ,�ӽR��uPjG���
�֝�*Iy������W��t�J�����^����(�Q!��H*�ֳx@�)��L�{n'C�|D�+�J2z L�孥`����\K
.��	~r�_3|{]*A�1�H�.#���2�,������g�UD�p*Ue)[w���d.M�'#%A4��ˑ�[y����B%�Ӎ?���l@c�CBT�䪩��D���|�4�*�@mT`��g�e�t0�r������+>��G�{���r~�gT6���N8Y>�5K�:�(��'����u���l���_&#�s롴J���߬VG�4J��
:DT�d#��;G�V�;]�Z{�x���:�6C� Ѕ�5��{�FJ��E	�,�X�i���I�5+����z�0']=N��v�׬R�R�t�)l��D���"�)Ez�x��7�+.���ſ��z���lR�����>G\�����%I^c�E�V�mP+#]%�,�4J"' ι$�Xx����Q�Up?1��;~U�:,��/}�K�C��^B�Ť����;ԁ��J�i#u�����<>�?ź �D�v�q����s��������8���W9n�$EB4"<)(n�*=�V���A�vb�I��|����C��De,ˊ2*� �ƥ���J�K����.f`�" ��!G|d�w�QFE#�5>�imiէ�zRQR?O��A�^Y�S ��y��P��/�\�2F   IDAT|����8g���e�$�W:l����z�d2��ׄ��Pl<��|�AM��e���N��rk5�i?F �b[�$q9�"L�X���\����yY���~��z��������}�C��ߨ�J,a�aJЊQIL��s�\��^z���8��m���f[����7�Oz���e�_�y�ƭ'�>h�NqmY]"����
 `�
�jEV��	u�0����)6��4�_�`�<&b���Ȧ���Ȳ�/''�r�̛;O��wK�;��^mTWP������g�uبa�P%�;~�L#�9���UB�'
���<��O4�|��ۋ�7&'���nu&Fc=�@-U�7?}�4��n!����st6A:΢����`���ąw��#�.
����{���X�/��B�I�=:m]����< �p�kː�V�a�Y�e[�������W^.��[V����DH�O�ٜp�`k����P}#g7I����F,�?��B|�ܔc��
��"�k��Za�@%P?qvV���i�fΨ)[^L0�Ϙ�U<��I}c��7��׷ޚ7d:���)}�(���78] �%�@%��D�DR��Ճ_�7{�~������L���r�Iv"FCEU��h�N.���Ħ�X,�%�b��}��Wd	��A��J�j��������{������2s��\U�39DNԬ�]C=n�s���IsS�>��_� �yr�K��tz:w,Y�8Ν�ޗ��&]�-�-�ˮ�v �P_77�{�.�#6� ��\ 
�iˏOb�����R�����qC`��
�RCh�$VgX��A��l��N$����we2�0�QF�-8������hi�Ā���8�W�Ȑ��U����\kV����|<���'}��%}��k���8!����l�W���{2��X�sE��BmPk#ޏ�����e}T����NO�����j�/�s���p�_�;�z��766���H�~�8!�2��%�[�j_�j{[�&�A���{6^��`=�ë��n�L~G@U%�k8xam�#�dD`��&@x�G��� ���0�\k���(�2�R�bT���w@&Tʪ�0��M�����[Z�'��w.�0Q�4l�|���~�CY�`��y��~}��*�"=� @_~1�Ʈ�J�aײ������^q����a��"ih�õ�*�k5�떗������k.��Y�w�_:񫽋u���?� r����v.7�W^T{]��W�xw��e�B
�%8&W�g^L���U��
f`�e�$�IT��
X(W]yui�c����_�C˒b|��tqԁ��%m��rB� ;� A)����=�#��K~���w����L~/��*;�M �L��߇����iV�kT�X�@����������1C�\D�*��1*���������DYP1f˔��`�?.w�iab�f���A
\F���Fy啗
3J���K����d�rq��EJ��
�����ī��Z������K&S/� 7���^����_�T�+��\H�^��C�Zh7���ba�k�������6�n#�\�oz|��Ţ�X�0�b⌢�h�x���]?�¿�oͶ�����O���#;��Se���ť[�
P��ҙ�ub]L�&�%���?O�jb���u���V8<
�]?�CE�U���
��*9�Tϒ�j<Eg2�l�٦�՘!P⫫<eY)�@E�2e���
�pp�$�T�8y��/�q^mhl���z��羀�@No��f_Z���`������8C����2�y<N���*HyG�*&�V�p��iKs�~s�oJ��ȠA���7�ܛU����FI�	GӢfy��� ��
 P�E��6ǽ��z�Ѣ�w �&g�X)<+T<���N���A�Nd���2i�dy����E@u'�|Wb�{	���`�:��2��0�T���_�Js٬��8���A�#��G�:�س�	]5#C�[�%C�����xZiF�?�RW��k���X���P�(���|��2w�=����|�Axՙ���w* KN�j	�)]*+�����^>Cusp��x�q���I"���7D������}0:���&�R���rmP�#�O�}���jkk�DQ�	���K��)	_��N��]՟��'Xz �P��T��ۥV�R���Ob����e�;ֽ�I�%��Z��e�^I�t����Pŝ>�Ԩ�w_6��.��:�>8�����~;�B�h�,W�V�!P9��k,������
��鑫	^.���r-�,4��=�Z\B�^TURq�4��c��\{iР��X�������}�l �)�����N:�*�@�l���~��;���q��c����
.m�?��ci��n���T���њm���7J���Y�8���{�)�R��'��D��$���iN�k��0t���S��|�IDlI�2���c�Z/C�(^tI)tk.�g�,Y�ҭhC�B�wι��I`�ܨ��ʻ''.Y�r�Vimi��?T>��M���w��F �' ���@�BhJhB�yG�`''�6�בM��۪����|�a8܂��'�G|�ㆈ����+B�Lx�/���LѨ��rѶ�����}?��u�m��U�B���/-.�H���������{A�Yf�`7r�(����u뭳��`�
��m��]g=��g��X^���|v]�ٵ>��Zs-��g�rk��X�}f��xZc�5iu��W]ݑV_m��\�V
���=��UV^ՑV^i��J+��F��F��F��i�𑮍Fx��G�v�F��񫬼�[�5z��x�G"Ў\b!'%*aMS��zG�|���
d�IC��n�N.��bY�3k�5V]íILA�o�UV�a�������q�(7�c1��F�wL��(�%��p6 
_q�+�an؊�܊+��V��[a�
�w��C��.?�
Yny�/�0d�:d���|<�� vРA��������$�E��i�`���)�<a�
��ӭ=�����/ ���(?Q���
��A�W�zTG�����ϛX��c�Ư�__�&�imi�f<�d��p������^��<��s�����!����`{����/�^���_~�y��ב�5y�����7ސ7�|�ӛo�%���zS�|2�m�;o�[)z'�o�-o��
���+���{O�{�}y���?�3g�̙3e֬Y r�,o�`Ƈ��ʇ����^{����'$�<�����vR!�`��q�J'�B���|������ϗ7������������{������ȇΐ3f��@,f��3g��bb�gL�f�B^��|֬�2룏<}��G���'˳?�-�gϑ�sf�ܹseΜ9�ϝ7W�Λ/��"�?�/l�ܹ�d������0���>sd��E҂�P��<�'8y0�J6����k�/o���9�z~�:��>'�v�lP����{��;�k�;��F~@�]���j�<�7�����iA,�]y���F�=��}��E�h'�`C<�0�{�%2u�EN��S�< ʒ��:��yr�C��Mܑ|>X��h���H�0��	)�)�MR��e�9m�RE�/���	�
��� ���A�s�s�o�#y �9�;MQ���&��@��1l��Z챜�NbTN���s.�Ɯ��I<x����e�xř����4�?��Xh;��T�L$�~�8�e,�

��&��_���$�QF�@e�ǭ2[��@O!�����N�<ȯ�L�����i4�$ ѽ�n�K�UUT�=JC���I��?'�<�S.Mrb-�mV��:ȱv�N�]��c#r�)e�|9%y��0�"/;��Ў]K�A�b�PH�!�)68b����Eش�rl<B����PP:QoO��
�����mS��˚䒄��ah'�o����uEb����vDI8T
,��GE�EJ��)U}}��ɖ[l&���r�$�^6f�Z���_
̛�����꒩��L�������S��.~��"Ej˜�P�X<a;R�òᦋȍ   IDAT�kAb�ˠ�ȉ�K��,>.�3�4�2"sX8Ia�9&�/���}
��Ǳ~��"mi�F��6�01�ؕDɷ
:9���XG]� } �t�0Ɓh�A��C@
�ێ��+�����I(
cq�P��<���q\��y�����t����A�v�a�?�%�#C��`��p
V�!�C<���z�1D�2��d:�5?)wՙ��wW�e�a�`�X�
"(H�
~pP "!3��!�%����(���Xpϕ�rIB}�������T�
�{� ��ml�+\�@H�D��H��^EE}��aa1���]`g8��dyB4���;�ҳ)t����L\�������n��} ��*���@5!p��Wj��E�����&����?N��>r.o#�@R$�U;Σ��|��'��b��Yd�X�I%|l��9c@x�o��0���k��(Q�$��QUUQM�$2��I*sh��6%�)K�u
���{��y�t̘���1C�����[�������f���M?/��󛀺��lK�VurI����@�����O�T.��CC�1F���������]�YfW�R1l�8�"�x�ߎ#������<�}f�lcLA#J��G�T|�K��@��`���b&�`CI�����
r���K+6���v�-��;��*�@5#���Oj��E/��b��׿.#����H]]�4`2�Ĭ]����3(�K�TT�s�4����.$Ѷ���}�bN>1i�j���\��=���T�Q(���
B8΋M]�U�(��H6��rcCc��5Rv�uW�:m�|���z���� �Y2z���*�z
��D���O����w���u�E����[n��'��W\!�^z�\�MB �]v�\~��1]��˯�+��R���J�暫嚫�A1M�4QH,�t��WɕW]%,���.��P�%�^��碋.�/�P.�0&���p�%��% ����\����,�ꫯ����F�A&�&���&B���s%��6\�>\z�er)�uYL�e��.G�+��·?��veb�R� �]��_|X�%�+��E����\ �{��:��s���ϖ�Hg�%���l�s�=��9�����'NĈcD\QD�"��"f]��$����8^,���Nb{.J�!�x!�|����%��isS����{z߽��^{����'?��e"` �`T���8=�#���ӓN:IO9�<Q?����N�t���#�t�w�qz����G����&�4~�x%�����c�9��C�+�;9Uϩ�����N;MOQ?5�nZN�ƅm!1��l�r�?e�6��ǣ
I��
��>�ܱ�yN8�=��$��Ą���(��w��?^�?�x�x,��H���ğx��|�O���SO��ѷ3N?]�<�L=t�Yg)��g����9GϢ�� �g�y��s�g���0�8�@��F�Hy�Я0���1N'x�y���'��,���N:�w����ۇ~�z;v�-�59���N�������0C�X1��q��!`��!PS�����:k�@�#`��  a�0C��!lPC�m]5C�����!`�6,L2C�0j� ��P[G
C��u��il�F�dC�0C�F�
@��u�0�ZG��_��m 
�0�0C��	lP�l�4C����#`�bDL7C�0j � �� [
C��u����
@{L�b��!`T=���!���!P�X�K!`�R���0C��rlP�l�3C�����F�6 �q1�!`��!P������:g�@�#`��� t���
C�0�*F�6 U<��5C�0j����cl�c��!`T-��ڡ����!P�X�;C�6 ��c>C�0C�J�
@�l�-��:��m�9��o}�����A�?�xw٥��iӦ�$Θ!`eA���w�'_��8�G�#�t�첫��7��6��sn�UVu+]�-�ܲn؈+>���CU\�m �xpٵ7�zC�~���裏���Xn�����+��N��ߏ!.Ru�Q#F����d���6����m�]��&�3N?�]u���w���5��UW\�&5����ݷ���m��Fn��Vw�VX�
8�e��kllt{쾻����yr�u�������w��3����y[�̞-�~�@>��i
�ط�l��5eoMӢ&���<�r���䤥�5�E�[ZdƬ�����3�=#������?��L���.��?N����e"_܀���Wq���n����E\�\?�>_��C�!p�]���'��9�m�����k��]&�̟t��r�����~�S��o+�=��������sdѢE¹����\.�gJM�{r��d[[*��8l�8���?RQ%�#
*N�as�uYɁ�m�d�!nm���䓜K�EM���;����{�v�49�����a,#]C}���0<�����;��/��v��C����K�i��|��ʫ�ev

unϽ���;Vn�r���O��_{M���$|�[q�К�<�[	�q3��$��9�`�)�l%K
��s.���E ���*�I�`�E�:E�?rJ���3D��<�$Lc`��>�1I�N3?�%/��<���r�i�х�
���`�5�t�n�-^1������52�%D��[ouG~���W��V[m5��f��3w�i�b�>]�����;�+�~�P��㧁���� |��X�����fN9O��c���,�	2��:�Lxu���+����#`��cT%�0ⓍT��h�/�P�ISlǞ�nU��P'Q'���`B��PU	���1 ��%�`�h�Ӄ7_C�������$��/r�#n�Q�����^9�{�;��n#C�(F�)S�QG�����J#G�A��3�:�@�������&�������e��"�rx��6��x��9�0�%�I8�3����q��G=�4'
$�}7)]��U8��� ����5����$u!�p��Q"������tFc �'4��w��)s�̘9S��׿ȵ'ɞc�H}&����K_���o��ܔ�{K㵅��i�������[g]7`� WW�q�z(��/�3>;3dт�Xj���r���b�Q<Ir��IAU��s�t�����b��?�O3#ș�2y�)��!��z����l���y?j\�+�
_�V���'+ޙ4����(�����K�z�vX�=����6��uđ��������>wܱǺ/o���8�׸;n��~�m���/I3�܋M6��l���
�ǃ�v~��8`�E�r��p�]�D,���N���tzf��%��%2E�oW�И�'7�-l�[�[���|@Jy����{�b|���dʍ7�*�.��ȑ#�w���<�F��!���:�v��n��!C���.r�ﱻL�v��������|�ya��B�ŝ�w�H\,>+BN���z dcdBp&R��|��t�h��@�+"�R�Ê���NU�UЇ�i�w>�K�q�Îeq74��������Gpjq�.����w��&M��P�}��/��}���v�^�צ�g������g��x#--Y�s[��}��!�\�}�/�'���=|b�"܏Ē�G���ܳ��g����8�b���_fb㻣x�0��O�7��F�>z�4�׻#��=w���v�m�p��xC�
�k���m��vn��A���)��"�=��|��|�4��s���"�m9!qU�b��?G�-�X��x���=I�~J�
kW
�r���U�+����/��Ysk+&T~�`ƌ�r�}����/���ꫭ�:� w?޷�ˁ�F�Y&^s���{�sC���>�,���EH�<����9��`�:H�A�I�F�/�4t�X@w�)�ݦ%�d/6�L=���`��}�,���9�Dh1�覻���d�A�[o�%S�C��u��F�,��   IDAT��m��:���ї8���J+��܄���_���2{�l\j�4��Tµ0\`\�Uq�� ��F�B���;i[g�n��蚕�u�+���i�N�tQ���K&sr�99�R�˂�|i Ғ�߰655˳O?#]p�dD܈�+��ƌ���x�D��.t�~qS7��ѯ��L~��{�m���-��g��J����z�;~o�%x��O�@��N�I�n�F�6 =������R�v��^�bY���'r~~�%�������r��wK]�n�e��������@[Ͳ	ƻ�V]�)���y��������ſVl&s�$�,�f�|U��_p�I8`ǕMAՖ
�D��^�7?T�FVPw�
@wв���@�eR-N�����b\�V<��t���?@������.㾺Ŗ��I���ѫN�����
�K�M�8I�{�Q���?��]>)�՞y�"���υ�\�ӽ4T��*�b�
�� ���w=�n���
@��,�,�	����O�Ea��rkkV����r̄	���m��f�ډ�:�S� �����+帺�ӧ��fI��`+q��ӛ\/�N�y�
{3w
�Hu�C����S�K,Z��!`���e�Վ@j�*���n��u@���S2~�Q��M7�����[BH��f����7h`�gz�{�̟=׷�w�|=����*s���{�8e# P�1���ON
c�z� ��VQ5"�'�4�?��O9䠃d��;���j�����������>iZ�7��I+^��o��a��я��ǖ�>'� E	��� )�����������@�a�`xw5,����T���-���wX%h3�eN>�$��J+sL�m��&���.[�_���z�Y���~:k��Xq�[¼7-�@��|�8{�N���m zy��j��Ѻ0�'r�]wq=q�W�N;���X5���L�x����?O���_!~��$������>(��Pj����Ny�����.��CFy�"w0/���G �t?��0��Fpр�Z8���y��	���?��.�X��"��f����W%�]w���|K��d܄	G���<+��_΋������xܜ��Ѣ��8��wre�@�NU�����uiA��G�=�@���Yu�@�!�Lc���r|Q
������@K�����r�A
p��Ï�|�c����7x�z;V����KF#Q���e���\E4��W���._��%�(�4���J�'p�=FVђ �O��d�<��!#�6ra	w��Q'oO��!�3f~$�]�[�闾��1��@u	�K/���@��=��-�@T��*ͭ-x���_�:��r9��.� �z�[�wi{Z���W�W���{�bO,�T�Ǣ�bJ#`�ܪ�	�$�u��n�+�P�,*��׿e�}���#��O816��7S����]�w�I'���'��Z��|X����|���h��B�$��� x@�F���y9�y��z�Y|X^�Z8�V���%�g��
���f��4�'���d�� �R��O���r,f��n������隫�v���qq����%ے�յd�??A,-H����B��N�������i�)�vڂ��<���'oN�{ݟ
�L���O�5�hC���r3������d2����?�n��֚�I�:�(7p�`�_���;� E��>�ЗG�?VLH�}/$nʤD��LN*�xg6.��8��N^Dis><m,�/�j�,)�XR��m���a�m�����	�����?��<@F��.<����ڇ{Q��m�խ\}}��|�������m
w���/�ތ5?

���X
bD�)p��+����'O(��R&QD��bޙ�8�� `����
�����6��6�f�S7�I�i|"r̜���q��첃�1G���.>m�t�����ɧ����T�!
=U�5M#��[!���bZ�^�P1)9%zoZO��ٵ�fkW��� ,9v�&�}���P��4�?��"�l��&�|�P&^s�h�w�?g�TT��?�|7|�p7n�Xy��W%E���,���=~�����_Y���R��J����C:
	��wf���򘯼���x�����m)f�>9�i�J��}� C¹���n--Y��;d��F�ϸq�v�/��b7b�Hwƙ?����K]��E͋$�;����8��-	;$ﬖS�����'0-YdQ�+���RƂ"b%>�b�"Z!K��m ��~�7|v��R����]f��Z�6�wF*aBxTy�@f�L`�f�:m�4�g�^c�0
��~:�G?r�v��v���x�pa��ߚˊ�|�@�U�I��!�j=�Y�-pʋ�KN
�I��rr����!���U��j#�8�R��VB i��QO#`��F�W����:��9�dy�+�\5w��^�<|�~�F�sq�$��9���{�������n�������q���=�<imi��kj����,P��1����-]�S(����t���K���D�D�I���e�fD��-���'
��`�HA'O��2u���V`9��5a��
��f��#�O:���',�WsO��t���/�7�[���~��@}���~��n�e�ug�}�4}��w���Y�ڄE_�d��}�L��y,�E���@������K�R�1$��I�(ʴ�r��--�<!��HS�T�̇�[�;���E��AR��b��ĺh#7�$e��]�	��;=����8������)*{��In�UVv_z�47a��Q���}�+Il.)Q�=K���_ :�e�H鼌�-a��"�2O�#�)E;���'�/��1�������,3ؑ$9|(+���±N���,xi�
��"�/�;�?s�̭�9E)Q�2$�
��8DKeC��.O�7)5���9�Iss��z�ҀW'w���ʲ[n�ɍ5ʍ�0^>�9K�٬���PM˅�M鱖��J���t}�()mK�E>��3����g��k�Ϗ��!��#����hʞx�^������N������$��I�{�����Z@9M)W�Ŷ�}���J�B��Q&�&�>q c�L�Y�G_��fsr����2�r��;�U,���z�����ϖL&#��#>�
�~u��N&Q���IA'O����<�勧@k�i#�DNJ���|�Q���2yG�4#�U
��s �:����.=�Xz�x	*\��'|2���L�,�.�+2�I�Q'�F�&M+�P.է��F��*0d3�Q57 ���,\�H�>�L9b��k�]���<i��6fy���ߔ��:ǟE�q�h�����}#����c�8r�A�N9��a����/�y�ch2���K�`+�Ry��� ���`BD[b����K�����)@��ul��CP�8�B@
w[�O娗S�!'Q�.�2��� ��"���r1��F0���(>'�x���9�����7��u�ai�w��;;�Ľ��K2��Q4-�?e̜��jЈ���3@X�ɠz�O�$!�!LT=�����ʙ
�E�ǘ6� [��2u��ޖ��M�0&�ȃ�<�Id��D��b
g��q8!���?9�",e���@ ��rce�U������s.�<����8�MN�<Z�~�IrPO�v�q��9;1tVf'٪�6|�7~�%��H'8ZZZ%�u�?�I`rc�ޛ�t=���������T��eQK�,jnBy��*V}��X$�lH�^z�D�\�pBߩ��j�{;
ދe����`<�bW�θ�b�gr�Pe�S
D�o/}$:��8��Zb��|���`�Ӂh���0���-�*��U�+[�����|�_��6�PV\qE������cU!��|d���(�u�B`�;�q��Pc�\���ԑ=S�2`��@5ƀ��sX�����w�,���.?`؈��/��jͶ�q�����1Ừ]��AI �]��IA�6�H����O����j��'CZ��I�i_b��
}�$�@�&:`Z �   IDAT�M��:Ns�\�) O,�(�H�l�喑���l������ ��>Yʯ��>����3��G�>���Vn��ƛo��Ǎ��7��]aŸ��K㓂(��rl��YU1���KU�H`�����+Kyj�d0�$e��G��ʤ�[�[h�9�� Z��9�����,�t��}�Y2r��A�η��T�-���8l.j�H1� u�ȉ��e�O�� ��{@�D9)�� ��	�����Tp
��!�����]}�>ʞD�.��ܛ�/&N��n��\����"JOB���N�$MR�0h�������.?�˯��A���O�~����2e�,�QoUl����N�:U�y��:���!T�9�a�9��C�_�����472���һyq1q�$ȃ�6��p2�Y���X��S��K�S(�(����:�3s��ǧ��|"Њ��'�>������V\q��?�Y2���t�ƈ*.!H�k �}A6x�cbH�V�~�N�Ny1џ��8��Y�K�v�PO����6o�)c(���7�$�}�ͱr�	ٯ�p�3w~�I�U�R8��
,묿�|�;ߑ�O<An��VX�����g�Շ���p���W�"ʅ@�h��T+�_"p�A��_�������ӦE���圮�����;�z�/�
Y^��x3�E��J:��`.���$��DU���Ap��6)<�P�\KCF]�b�\�Ɍ�#��&����[������rn��Vr�x׿`���`��#«��
B־��dA_��u���(C�)ȴ����)���I���R�yh��P� �Z���@����~H�gtP�i�R)S_/+���|��_���>R&M��a,I|�������W���^q��z��N�Q?@ �m�&�~t������^xA�͙���,?��9=����������z�;�a��Ʉ��x#�%LH��n�<��\��P�L$�*Q�Ȫ�2��,*�*��X�W�gLʆ�DX!�k=����
���H�g��,X(Θ)�lV67����!�y��<�T�{R�xڀR����X�g&ȸۦ�T�	���'��1{����L��p�L?t�H��� �,9F1Q��xk<��8|�|���}��W.����(�ٖ}��w����^{�$�Q*�xX��C *_QVR�"p�E���3}�� N:���2~��R�JV6L�y�Ɉ�J��$�.<��\6��
[�"�Kf����	e��=&L�yv<��ЋS��MpcF���CZZ[<��fi��t~T�~*t�Zq�g ��=��$�$����q�Ym��Ӆ�D�XU%RJ��݉����Ps��E�y�w2y^x� Ɂ<�*_�lS������&Ӂ �͜���������N=
6������;g}�]Ǝ�['M������Y���Y�#�켳|v�u$���IYU�$'���1��d��&Χ�"��8�H����G�c�΋A�8�J@�]�j�YZL�}��>���2�O�]mZ��2H��'��I���)cK����1A<k¶"��!����,�2�0|��$���]G��wۗ�ӹ�g�O<���z�uđ�!����XNlPN4��.!�I��<�/��?�#eN@:u�49��Cd�
7���_N<�e�!@omRU?��w=�YE[�%h�m8���f�]�h��M~�;�U�ط�n���F�}����)ȴ�Qk#f�FF��M+��=�.)ͥnܕa��D.�B�L{���D�����zr����,��?Y������9u�}	�Xj�@��dC���g�8�����g���p�����v�����j�1)v�,.F�<�mIm��Rǥ�O��`rRb.3�\�K�P⌁�i�J�\�b^ܞ���Ŝ��� x�x�\!�RR.}y+lH�`rOI e/�^xP���=8U���_�Qww�0��ed��W�1{�%��q;m��Ԣ/>��^?i�����H֧�"`���i���#;\��O��7�ĬșT����xJ�P/���S�4�9�R��|w
V���}I�$���T�����>Z`�l�<��<m+B�n��c@�	��=>��c��G��eؐBD�|���d����@���x�B%���u7\O��0���ZZ������wL����A��!�]l�]�,�W�i�}��絥�E��~7n����g:lS���ؚA��/AQ��mŤ�Ŧ"}q���T{�NZP��J���dr�ȃ$|9��2͔I���0���ӧO x��T#��.��4h�
7�XN8�D����yN�����v�z^n�rh�=�����ӦN�7�x��N��z�v��d�!CD�IX�.��	�gL���*\�u|�
��
7~	bD�Iڎ�,��b��7�'��# �;��hL����#�!�5 ���y(��(#8� �z�;9U��G�F���(L��B���i����ر�6/j��~F/��Rd�ɒ!P!lP!`�؞G�H�2x�����9sp�������Z�'t��&A��'�������TU���	��aL��M����\q��RTY�pP!1��[tO�A���Gj�v���I����!�ה��,e2^Xn���ߓ�\/8t����B��f.?�(?�VbA��K.�W^~�on��f�v��d�AX�1#�H&��*?a���lV�t E��s��1��EP�-�4i9�x��JBX�q޽�8��N�O���M ��x�ǣ}<a��p��p�Ҫ�ȁ(8t��9��G~�Gr8�0Y2z�|�V�!гt�A���,����ƍ��+&����ym�8�w`Fb8��˪���$�$��z�0�L��1s�\'�b\�M��k�$�{�U=�I�,�^$`*���6���<�g8g�s
}��w���(��"`�@�mƫD�V�!�G�wf͘��X'}��Zi4&n~��wh������$a��&�\�G�(P*;�β��i�=^a��������2�쐽��0ڃ���{8�(��%<��D	_�;�Rr���%�S������r��J�%��4��3Ό3�Lv2����Nc�%�@o 0�k����SL�z��ɨ�W���E �0�cI����Xӹ�ܻ�ʒ�J��ڴ�5,>_�W��&u)"���@X�1b�M� �l~�W}_J���)���� ������񝾓�?�.��X�����D���E��
����Vj?E`��k�����l���%+�{��XR2f$�ԩD�s1�\��`�K����hq�-Ť�pܨ'�bt9�K��S1���>3�� ���A�BE_y�E=����#C�? `��0J��^A`��I�Ѭ�����?��Zvقv����,�GX� �E*�
�f��`S�"��TY��DgQ��'��e����YD�S�byGƐD$��.���e��Et�G��]�T�*���])⫺R�[��@� �������
7�(_��[Q�-�⏐�BrX:`��G� (�L���?�?VM�	C�%�	�E8�
͌!v^N;��<y��̃�m=l�����5�8��<�)6m`>m����u���z�ͷ�p����@<{��X�
�D�C���*9��i�e�_._{���*���_��2�S������"�5)�j�sM!��$� \�`���N̜�� �4�c���ph	�P��1̒�d��7��&]#8�O�#�-�4V_��*W��lT7�&NԹ��pa�-���DuuX?T��Α_#	��R��`�i���'�D�Q&��<y�k�� ���i	�2�YC�)D����wB�q�8��>+�A"�q��+���3�}Z�4=,���:lPuCj�
������ܬ�w���b�����z��"8�����e(H9�rr%"A/o�����⥭��p��<GH^�M�:cAAf �#�g��і"��p�}|��1LE��Y�|�󟓛o�U-X��}A�g�7�:+��m *���]s\y�U:k����   IDAT. ��曉*�<�4��6W#�������3yY)���e��|����XR�0؁A��d��4�MA0��{?td�	�y]`���=�Q���;};�҆�X�=��8�����w ��C�V�
@��������_��Xpt������[e$E�~1�K��$�-A�()g���
*��6m.փ��|�ǔ-��N
��<ˤ�r� .��B\1��9��0�(��9Z.��R��8�>F��N}kRe�g���a�5����ݦM�ŗ^,�G��XD�|���a#����j������pr�.�����BX\n�{����8A���� &��?���$�nO�"x�E԰���eTr���Fl��{��)'��;��@2�f竽�_��܎���r�!�s�qSn���d�w����N���N�>]��p}l�
E�X�nH�8��y��EQ$��Ƽ�!�ᐉ�ĉeS���i�Փ�����D���}��
���R�I�°{��	�k0�x	��z���;�'���O##E��D�+�r����;�YK�Wi�JW`�������g�xD��<E�:�,9�Ѓ��'�8`�[n���董�&o�v�q'w�����k��%Q� �;V�{�9�\9�v��_�4��L&Y�Dr9'\ĸ9PQ�9���J|�&�HqD�s�|�#�[�ʦڎ`@B�%O�*�r�=?;����``B�#ǂ��/��F�GQ�W-�B�U���#��\K��䡇�U�,W\v�;���?��m��Mݪ���]vYW__�2Q�D�{��r��Ir'6·�z��l�����
@g�T��OB����t�E2o�<�1s�<�����_�J&_7Y�?�ilht
��[ޭ���n�m�s㏚���u�a-s)��<�('���;I.Y�0Y�Rs<����O�"|Zs�x'sa6ej�)1�wR�e�K�XvR ���)��܉%f��%��
q�g�'"�&���X��&��e�GpRW_'<F���v?�����'���ʈ���]���w?�馛�������PEe"w����5��GyX�����#��ϗ���Uc7$\���_�cGڹ�`J�d�Vv�E�Ͼ�Pf}55Ik�Uac���$͠y����/�$���o��o�	�b,3����5V[�m��6�#�r7�x#��-?��C�ki����Ï	�p#�ş�aASQUp�H<@N�����2���.�BY�B��s$�m	6ħDh�GNb{�Y8����P��z+�E�r�#hB�ȑ�d*�(?x�}��}Y����q���W��V:�
<���F˝����;��?����2���xB���KT���,|�՚���:L���r;����D�-�J�+�6�wX9���f,L��'��	�[�-����믓�Gś�����a��f�;�s�1��3ϱx�YW�}�ܫ�Hu��'Y��U�p럃�EOx`0�V>1Qn#Y�C9\��SkW�;�6y?�=��)���lˌ���C���j<Mq3��
c��?����7�P��^y��wt�ZA.K]D�;�����n{�ꪫ��Yq�;眳e�����O�ǳ?�O?�ԗ�����xq���-];aH��=�ؔ����'�'j�:z~�K5@�;���X.F���V��n���X�¦E2s�,�;���n9�ܳ��w�Za�
7t�ﺻ����ic�<��O5�ڪ;�pg!��Q�L��+r����9\�A\�<^�Kء���IN��u�F{:��f^LL(:H�9$�=��E"� �ÿu�]�e��>�{��C�u��Yg��v�aG��g�t����^{���.�L��c���o�a&�@c�7������T4RӦM]̕Q�Z���ǫ���~���慠ͪ��fUU�"^*�?�pI�#D�g1�0f^+��ҋ�����N=�&7x�@�}�����.���%���s0�[��^�SÙ(�Tx���N�q�v�I6�:*]:�� $,�s&�X��|�b'm$43�*R�!��+�����i͂Gϒ���Ͷ܂����s��h�F`�]w�C=�}�_t�.����g�2��sϕ_������5_S:p��)���}1��K����duf�����j�58��b#8�C��,m�7X*Xv�X��������ASxb��	�oߕ���Q9���ⰾ�5�Xݍ�s/7}��#$(?��ϵ��I����	'������i���x��ُ8bʗ��eTF�T\m$�	׍?K����k���>� �d���,���O�P�5O�:�}e˯�e/뀕���rӔ�䙧��O���9ɶ�p�8��:�Q��/�� ���;�]>����
�r�DK�ײ��>cHK�\նB�7,�y F
�☜�a�rx���,&&n,f���}O��^9`�}��[m����?���p}m��O��b6�u�_W�~}]��w���]#~�|�g!�Z<��� d�J�ZJ6p��}�(ÁT���R\�����)��_��'(�.�p�
n�wv�F�v��3�w��x��wY�w��8���SNZ��v�<�h����y��HW���̎�E��X�|X`O!_1=U��ӣ�r�)��~����I���/ʈ#�q@c܆䃛�d�G3�mw���8���C�8U$O�$J�Mp0ړB�JB�_ �B���YVZ�S�����o�C?$�~(4q�G�t������[���ڢ�{^��.>j��xC=�	⧢��2�CU���7��a�l�� �>�|Yޖ�DXm^�m���E��cG#l�����k�C����?�ڢK.��m��vn�ȑNU��&�<�����Cɵf%ۂ-3������|"�<��kh�	y
�B<D�R!��	c+̃��L����e�*��*_��e�������-��_�z��G�w�c����/�X�}�>������Kg̘�M������^u��r�1�ʎ;�@6�`#lF���SmPU��HT�
IppR�����z(�U:q�H<,���(Wb���ـ�|9ݡ*~�!*3gΒ��_>�`��:���;�C*�r����;��Yg���'N�����I6��y\	'�NT�G��$9d"��R�uKgU$^/0���(�pd����w��*�]g]���_dv�5C�w���V[�!C��(�q��q������:1�GA�y�o�J!�����K���|��ci&_�¶�r��Fm$���w��O��︃~���O>�w�z[���)���iw���N�
Ȕ�C ͞��j�C{�1z���
³�>�~��b���2O?:�L���;��k�?�o=�&�:�9hc@�{(�R�3�S0t��'���� Or��$���_~Yn�r��G�<`���W�t�!�uPb���9�\Ͷ�*�t0'��e�1�7����g�)/��[�|�8p,��ӄ�:pq�D",
=¿V�u&|�/�h�([�,?D�:U^�����K/q����n��s�� ?:���_�"sf�����8�1v��hZ��|�:�x�9�?�|����*QԶ<d�i�喓�6XO����ȩ��"ӦO�qԹs����}Z��_�\����/*��R�F�m��t3�q����眣?y�}�嗴�)yz ��O�C�:j�l�Ŗ2l�p,Ę;$>"L��\N�\ō ���
�9ނ����ɓO<)��q��aC��J+���ُ!����ЏV������8`@~Prx�B T���
%L�^&��)!o�#��;lEyu��}�"�h-��1��Ȑ!C�5k��3n��j�����p�]�
+s Ýzʩ�?�I������������?3�qRMÓ���8u�u�� ��(j��g|:3j�H��+[�!�*'O��lk�Ο7O��闿��^p�:nl%Ƌ����)����}����\s�������=�ܢw����#?��d�M6�e�,��H륡�N�0�cc���d��g8�Vl�{�=�}��wݖ�o᮸��8��*��{^�L�"
�?�D�����B�f   IDATa�WUܑ���v����ŝ�qI!UW����(��'�K���?1�(^Q�d���q����q��q�PP�SO=�m��F.SW�ƌ#?~�A����B����3n]�;�@��ۥ��D	�y����f[n��X�7�Ï:R�6�uٜ~����_��7\w�N8r|a&FU
Q���:�'�k�^z�g�ø}�?O�'�?�lkN��Z����ͷ�BF�-�+/S�S�n�ޯ[����fqJ���2Q�9R���Y�	9���uo��;�Gg��Zt�!���?��Ϝ��E�4�h���&@<��w�ӈ�a(���D�D/I��x.Z9���������� �`y�R�6:����ʫ�����%�^*�{�E��'�|8�T	v��'U�#�oh�l��\%��H82�u�ꪫ�N;�$�w�̬�f�����7���ɺ�}h��W�*�Y����j�e.���������b�{뜞y֙��7���+�(��z�#ȨWe�m��[.|�r5R��6�g�{V�=�\������N�ϩ���t�e�i�o���k����L�_[x�	U�)�YQդ��'j1��1W$���$����؀�v��Zk�$��O~���8�@7r�H�n��F�����m�I.���l�e�*��B(�aBp�8?6��b9t'��T��1j��W.��������o���<��������T�D5�{�|�#p�Y��������#�6���#�����Fm 5��[��4�E-Όs2W��3��	]~�Mʹuu������]$���m����Ir��~���?��fuȊC���L4�E�X^5^X���
(���)�`s��� ���>)�N.�����<�yV�7��:�(��*��(�iS���Y�E%���������E�b���A@i�I�ic��L&#ʝLL�,��|�ߔ�~t:U��|�?��O���N*U!��(Y�z���+����!p�5���g�ׅ�8��E_(��fk6|�d�"�2�ID�t~0DyJ�Q
6��T.׊'\۲xd��/�Yg�%u��/o���|�d�����i�Yz�GH+����8����da���w��$�C�#o�?�
�(���:B�p��ww��菪���裏q����7y�d�������Y�[���Y��`�(��V*ѝ�[Ai�h��>r���2���~2o������ϻ�-K�@W��Օ0�1z�SO:
��t��Y������M�w�����ʾQQ�3)5r��si�?�m�s0��yG����֡Կ����=0����Î._H?�p�䜎=R�ڥ��ٕ�N�~+ o8M@Q��pU�Ƞ	_�G����jk�#�����������m��f�q@��v��޻�J�@��x�<'�`�縞��.��%9b�qA�ݗ��uYu��e��SqR�w����C:�:LՓ�'=� ?�=_��h,�z�>��/�����$�w�u�����^i��aҌ`��A�8�ә(�(D̈���ޙ�[U�{�����{A@��ġD�r�8e�fZ��K�� j8�`��(P*��!'pD噕ڣ�Ay�e��4SST@43EE�������׹� s����k�k��wq���>�\���gst����.i�}����m�I���Ь���ND{9������%?~x�U�3�(�0������g3kg�8�g�biL�������N;�T<��#(���%v�jG��]Q���O�G�0��l,=�/��,�4aď)���=<d0��B9����n4fh�.'P����ͪA�>��;�j���V�M�j���ѻ݉,�,���rW�R�3[��pxc�۶ϝ;'N ������H���)^�z{�j@�e����w�>n�$�[�;�msO�������Û����Q�yn]t��B�3�8#��>�~6�gX�h	�ƙ~����)���F^�SL:�Jd�������l����#��͓n��������5X�M�K@@u����@��SN��n,���z�)\J폦�W�Q�Wޱ�*ey�@Q�������Ɲ���|��=�;|i�`l����t>#fv�ms^x���NNϖ�p�
y�$I��ߌ(��o �N�2|��ի7&�<	���J�Sg�m�o{칧[.��2���?h�!�ˈ3�N�����N 9�b��:+�$�\YGN<�7]��g\z�w=m���U�����/s�;�b�.���ͫuX����:s�ko+۷F����k�S�J���x��w��sw(9o�^^.�:@�<��?�3w�|\u�(5��ڕ�z�O�x�Q���G3���c�s
=�B0:��g�G�(��8�/c��y6�����'��l�7:���Q��-��g�0��t��vI?��#�\��o�^��o�#���.��v�7��R�S��F��K�۵ua�vg����泽�?�A���y;N���9��1Q�ǽ�)�Y���$+%(ge0
��}��a���^=l�e�0f�X?��u.X`������TjB��C�y̑�	zl��{�B����I�.̊��:uj��#�������_��������)|G���y~�<��i?��C�y~�����G�l��q�i�� [0o^���2�D������PW�����a���!v��a�=��XE7�����3�(�YXz��0K�ګ�a�p��g:t貊���n��Q�"翖Rs�?B�_�2d(^{m����aw�u�:{a���x�������W8x�,�����|�{�����q��Q _���������+v����#Z��`� l�e�	�qv�S�Ȃ�{޹�M���7vn�|uh;�e�qP$V⌘����]����x����'O��9䐷�j�5v�8�8a"��,v�7���-i��n���Ǭ�ߍ12���/�r��x橧�_�K�m�΁��d	8�7s�:��㠲t�!�b���u��1��Qp�������^��k(�@�୩v;����� ����9/uݎ8����7v#I��]:ş�G��Z�@E��R6Am�l2a,���%����ǚ��K�r���)�g�V>|��yfG9��ͯV[]\aoN:���w����/���^�u\��q *f�8V�du�}<+Ŭü���I�^��غ�6�ϒ �_�c��(A/�C��hu�yuY���;ۛz�]�`��������x��
~����CtX��=���(��cL�#����_���!����[��/��O�������`�k�go�ӡ�J�Ma����7��r��q��q��J$N��%(3���>�����b����q�d��4g�}w��<�D�~	��߱Sϻ����ӭ��ݮ��
�q$ijV�� x��tX���z(4u&0�0煿�g|[m�e�t�wC7�����>�R���4>߯��^�����#;� 3�1����*[K���ρe���z��c�
�E`����D�F`��=��ی�Y��6x��ؠO/���J\&�h�Sg*�RɌ�KF]s| ��i�%�_�;��-��b�p�ŗ,S"��m�v�m7��寐08s��OȖ�1�/�>6`1
�qd��S�>��!�vz�0��x�[v���ȍEډ@C�wGC$cD�;	�Υ�Eo,�/�;�\DJ�R<�/w�3H\`�����0V`,��̋�cx���q�ȳ��&�����[J�ɓ�λ��\�SO<�4-Q�s�324R�3��ߛ�?��w��0=N�L��Ԍ/~��=j�<�W;q�	�	hdr yte�X��g�9����S�7v��!ISP�b��3.�1���>
�&q��|+z_��$��o��<[l�i��{׸��&���uҭa��°�C1�ɿ��Q��|,_�@"�3iU�p�����xnL�O�
q�Q(�����*�ڋ@1�SCe�t�������̾u���F��vJ��s���'<�yY�#�ĥ
��4�sFkf���|�   IDAT;wN��i���
��}�=����c��$i����� #?D�'�J�{���c�[��R?|p�]1e�x���q�z�@	����f�dx'��O_zɥ����v��������I�-���9�#���P�]�J.T,t˲2Ҥ�gg<�Z��ky������,I~9g��Y{<Fˍ�<DG��R>`}�����J)E��/���s�������<� �$�wP!��"�mN>�d�5s�����ۇ 3$L%�u��8�b\���	X�yI)���e�u������E��g><҈�#�
����ۇ~�v:A�a�q ����7c-�tg)��?�/���&VM0h���]�/q�1C�� 	$�D����c�>n�����8,I�\*Q�@��hy�3�ZG��x a�X���(vӦMW
!C��]T�:�?!4������d���f� \	 *�.w��Q_)	.��^���}�^�z�NDVn�;�L1fjX� �:˥�>�ߖ�3;��A��_4��G<tH���1��x�Y0�ǸG��)�O��}��Q�FW2��:_4>l���ƛnDN�' ����h�Y<ĝ���	h*�s�d˼��M7�����|î�V���h'+  `P�U4��ޟ�7�@G`��/��GR
X�,��t�c�(n.�����$e7�����q��b���wM��'y����zK��6a��#�p�Bv8�\nh�9#��3(�I��20m�2g�t�����[o�+��1�-@/�U�k�*�7�t�-~k�
?q8�7����I�8jW}�4��Y@B���O��!Er΋sp��#q�a�ռ���?�;�8���+��*��1����sI�b��2� ���h+ f%i	���}�r�xq�v�1�2z���9 �IU�@-Y7q�
���Ev�1Ð�)Kb��쟒����T��+� �)��?g�O�!M�p���yVl�fv�=�������?�>���x�n�::5�":E�U�-�i���R��6�n�I�n��石���~B�&kD��NZ�STYD��&M���m�v��R�M;u1�s���Ŝ�崔¸"�s����$)a,�� �XZ{�Eο���g��a�O�!k���K�K{c��v0Rٌ� n0�+�Ӿ�7 ��>sf϶�_�'�@����XvgY�3U_�@mq�=�E�>qЁ��MeYL'�2��������m�93��	3�/|���Ki<��v���{3f,/|Y^F2$�eׯt-IR� �td@�� ��f[�v�$�x�6D�O$�D`��X'|:Y����L7^ɶޮ?@�c<����$�ke,36G���A����?��=�h�
õ�\b�n���!)���?������H�r�{������}��tbb�i�	[��
7�xC|�?l�0Vdum" �L�w�unC
�@�����z~�}�+�ԣ.�)E��i�#����U>`��!����������SO;{�G՝�~[nn�p'tB|��/K`�6�� q'�����ǔx�ۧ/�=
/����p��8�h�.%�tikjLD������m��+_99��S0��s�Z;�xNQ5�lJ'����G{��񗲖G�.uԑi�ϝ�F��+`�.�2�}�c��[��4A�Ԅ���u,X0�F��
�KD�
:ޑUhYM�@���^u���`�1 I�L�t����%.�̈��(��˕���g�8�~��]�l������)����ꗨ�u��[L'z����?fYG�聃�d�b��+��5D@�E���j5�vE@������<��v�>Ψ���� p�OяN �4g\	��( �j@� �����ZZ���񗬵#0pР`��/�� ��gy/�- M��c�t@JM%����cO�eS���ĠM������J����F�Ό�gب�΃Qd�,���(�	�~��<��S����l��2�9�,��^,�Z�6���w�lmmm0Wto�-��r��	0�������!n�<�<����USD�+��
�jCj��ر�uI�t�'��R��k9����$	�7T>
@��lK��2�����=7h	�����Xy8餓B���\�&�+���C�(�q	bH����1�w��'c޼�m�P}�ϙ(�@w����u�!����������6�o
-Q�=��̟R�&	r��]�=���N�d�9����:;�s��ƛ���ŭ�a�����L�J�����̌�ɢ��3~w8:�`:�v����{�D@��m��euM�� 0�ٙv�9g��e����xI��iO�<���JHS�l�)W~���c���}�0�������P���V��� �P��٨Q��T��x��-={���ΩS����BV�&"�^	�X��u��E�H׽����`�hv|Ӈ��si�P���=)%Q�[[[���_A� ���a�w����,i]�r�>�O��ئ�q��ܡ`����ÿ~�̝��
8P�O"�D�$��	�AD������v��Q�s{TK_��A�ytr.�\��� ����<�g�{~^k[��}F񯜗���4E�B��_�+����V[�OvϽ���)r jj8ԙ�!Pܫ�;�����c�,Bh�h{���\��� U۳��3:>�w��e}���xR�R�Y3�zY���Zz�p5!���O�왳���D@j���uI�M�7���d�x�)�={�2=%�K�~�$uqg:gC�$0
�R����{	t E��+�@sK��k�&L�^��$D�F	$5�/uK�F@
W�5b�q�޶�v �:MR�>���1���{��3i�|
�&H���Bf�g�-=Z0����=k+y���@-�Pˣ���@7x�ɧ��OD��	=Z��Eޝ��0 �;t��?��_�K����ǒŭv˭��v����@��P���u5��"&L���K���[���|�K�	��ĒF��U���c0h� <;�xJ����@]�PäN�@����l������|��?���~�<� j,�է��+.�S���NGAꎀ��2ux]��w'p߽?����ŭ�ؠG�xB�s9��W��K�b�ͱ��վ�կh�	i'�G@@���z,U'0f�Xvː�gK4������y�9�9K_�� �"Per �X���eM	�.i�;퀶r��k/��h���8kڔꋀ�9 56 ����"���c�uO�XKr ��N�?�����2r ��PLD@D@
C@@a����~��	�X���" " "Pr 
2�E7S�����������PJD@D@
A@@!���F�~�w��N"J�����@�(� �D�/" "��� �3刀���@����C\te�������X剀���@����\t�d������	�X1劀���@C����[t�d�������X勀���@����[t�d������	�X9������@��аC[t�d�������X������@��Р[t�d������	�X5������@C�А�Zt�d��������n�T." " 
H@@j�M��" " �N@��3R
h8r nH�n��Xr V��ꈀ���@���`Ztsd��������z�TKD@D@����΢#�E@D@V����%�z" " "�@� 4�`��/" "��� �>+���! �a����~�5! `Mh������49 
2�E7C������9 k�K�E@D@D�!�h�a,��_D@D`M	�XSb�/" " 
@@@b�M��" " kN@��3�" " "P�� ��� �/" "�6� �
5�#" " uN@@�`ѻ/�E@D@֎��)�Y�  uIDAT�㦳D@D@D��	����+z�e����������t������19 u<xE��X{r ֞����% �n�����" " �B@���ӹ" " "P�� ����۲_D@D`��X7~:[D@D@ꒀ����wZ������+9 �JP狀���@�P��V�.�~�u' `���;r �nȊ�a�/" "�� tE�!" " uF@@�
Xѻ+�E@D@������VD@D@D������*zge����@W��U$Վ�����9 u4XE���:r ���Z��! �n�����" " ]I@@W�T[" " "P'� ��@���_D@D�k	��Z�jMD@D@ꂀ����wR�����t59 ]MT퉀���@�P�T�.�~��' �뙪E�yr j~���A�/" "P
r �AUm�����@��P�T���~���P�jUD@D@j������wN�����T���j�U�" " "P�� ����k�_D@D�z� T��Z��% �f�����" " �$ ��tն�����(9 5:0E���.9 ���E@D@D�&	���a)z�d����@�	��6a�/" " 5H@@
Jѻ$�E@D@�O@@��
" " "Ps� �ܐ�C�_D@D�;��ʺ������9 56 E���r ����"" " 5E@@M
G�;#�E@D@�����"�눀���@
�   ��p�`   IDAT NL���rV    IEND�B`�
```

--- Archivo: /src/assets/logo.svg ---

```svg
 <svg  version="1.0" xmlns="http://www.w3.org/2000/svg"  width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000"  preserveAspectRatio="xMidYMid meet">  <g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)" fill="#2563eb" stroke="none"> <path d="M1085 2306 c-16 -7 -41 -26 -55 -41 l-25 -27 -3 -328 c-3 -366 -1 -383 60 -420 32 -19 49 -20 510 -20 l476 0 31 26 c18 14 36 35 42 46 7 12 10 138 9 355 -1 325 -1 337 -22 366 -40 57 -45 57 -540 57 -355 -1 -459 -4 -483 -14z m566 -166 c1 -191 -13 -180 241 -180 l198 0 0 -75 0 -75 -198 0 c-251 0 -236 10 -239 -169 l-2 -126 -83 -3 -83 -3 0 130 c0 181 15 170 -239 173 l-201 3 0 70 0 70 201 3 c254 3 238 -9 241 181 2 75 3 137 3 139 0 2 36 2 81 0 l80 -3 0 -135z m-201 4 l0 -115 -27 19 c-41 28 -314 182 -324 182 -5 0 -9 7 -9 15 0 13 27 15 180 15 l180 0 0 -116z m608 99 c2 -7 -1 -13 -7 -13 -11 0 -326 -174 -348 -192 -10 -8 -13 14 -13 106 l0 116 182 -2 c134 -2 182 -6 186 -15z m-983 -32 c3 -5 53 -38 110 -72 58 -34 108 -66 111 -70 3 -5 -45 -10 -105 -11 -61 -1 -119 -2 -128 -2 -15 -1 -19 9 -21 59 -2 32 -1 69 3 82 6 24 19 30 30 14z m1015 -79 l0 -78 -107 4 c-159 4 -155 3 -98 36 28 16 82 48 120 72 39 23 73 42 78 43 4 1 7 -34 7 -77z m-640 -126 c-5 -9 -379 -18 -393 -9 -4 2 -5 9 -1 14 7 12 401 7 394 -5z m630 -2 c0 -14 -23 -15 -192 -13 -106 2 -196 5 -201 7 -4 2 -5 8 -2 13 4 5 91 9 201 9 170 0 194 -2 194 -16z m-630 -353 l0 -131 -172 0 c-149 0 -216 8 -198 23 3 2 86 50 185 105 l180 102 -197 0 c-176 0 -211 4 -193 21 2 3 92 6 200 8 l195 2 0 -130z m630 114 c0 -13 -28 -15 -194 -15 -177 0 -218 5 -199 24 3 3 93 6 200 6 165 0 193 -2 193 -15z m-300 -65 c25 -15 68 -40 96 -55 27 -15 77 -43 112 -62 35 -19 61 -40 59 -47 -2 -7 -59 -12 -180 -14 l-177 -2 0 110 c0 127 -3 125 90 70z m-604 10 c55 0 93 -4 90 -9 -4 -5 -37 -26 -74 -47 -37 -20 -82 -48 -101 -62 -41 -31 -51 -20 -51 59 0 59 6 73 28 64 7 -3 56 -5 108 -5z m914 -70 c0 -78 -6 -83 -52 -44 -17 14 -52 36 -77 49 -25 12 -57 32 -71 44 l-25 20 113 1 112 0 0 -70z"/> <path d="M700 1200 c0 -66 3 -120 6 -120 59 0 331 -56 439 -91 108 -35 299 -128 362 -176 25 -19 51 -32 59 -29 8 3 53 28 100 56 194 115 440 197 669 225 28 4 62 9 78 11 l27 6 0 120 0 120 -67 -7 c-269 -27 -569 -113 -743 -213 l-65 -38 -65 38 c-184 107 -450 183 -737 213 l-63 6 0 -121z m267 44 c171 -31 341 -88 490 -166 50 -26 99 -48 109 -48 9 0 49 17 88 39 104 56 243 108 390 146 129 32 331 64 342 53 9 -10 12 -122 4 -139 -6 -11 -37 -20 -97 -28 -117 -17 -291 -62 -389 -101 -43 -17 -139 -63 -212 -101 l-133 -69 -72 43 c-190 116 -386 187 -612 222 -146 23 -135 16 -135 94 0 37 3 71 8 75 9 9 108 0 219 -20z"/> <path d="M700 901 c0 -28 1 -28 68 -34 242 -21 517 -115 710 -244 69 -45 88 -54 101 -45 111 78 268 159 388 200 131 45 352 92 434 92 37 0 39 2 39 30 0 35 2 35 -128 15 -279 -44 -486 -116 -671 -235 l-80 -52 -33 25 c-105 78 -317 176 -473 217 -71 19 -305 60 -341 60 -9 0 -14 -11 -14 -29z"/> </g> </svg> 
```

--- Archivo: /src/assets/logoNegro.svg ---

```svg
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.10, written by Peter Selinger 2001-2011
</metadata>
<g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
fill="currentColor" stroke="none">
<path d="M1085 2306 c-16 -7 -41 -26 -55 -41 l-25 -27 -3 -328 c-3 -366 -1
-383 60 -420 32 -19 49 -20 510 -20 l476 0 31 26 c18 14 36 35 42 46 7 12 10
138 9 355 -1 325 -1 337 -22 366 -40 57 -45 57 -540 57 -355 -1 -459 -4 -483
-14z m566 -166 c1 -191 -13 -180 241 -180 l198 0 0 -75 0 -75 -198 0 c-251 0
-236 10 -239 -169 l-2 -126 -83 -3 -83 -3 0 130 c0 181 15 170 -239 173 l-201
3 0 70 0 70 201 3 c254 3 238 -9 241 181 2 75 3 137 3 139 0 2 36 2 81 0 l80
-3 0 -135z m-201 4 l0 -115 -27 19 c-41 28 -314 182 -324 182 -5 0 -9 7 -9 15
0 13 27 15 180 15 l180 0 0 -116z m608 99 c2 -7 -1 -13 -7 -13 -11 0 -326
-174 -348 -192 -10 -8 -13 14 -13 106 l0 116 182 -2 c134 -2 182 -6 186 -15z
m-983 -32 c3 -5 53 -38 110 -72 58 -34 108 -66 111 -70 3 -5 -45 -10 -105 -11
-61 -1 -119 -2 -128 -2 -15 -1 -19 9 -21 59 -2 32 -1 69 3 82 6 24 19 30 30
14z m1015 -79 l0 -78 -107 4 c-159 4 -155 3 -98 36 28 16 82 48 120 72 39 23
73 42 78 43 4 1 7 -34 7 -77z m-640 -126 c-5 -9 -379 -18 -393 -9 -4 2 -5 9
-1 14 7 12 401 7 394 -5z m630 -2 c0 -14 -23 -15 -192 -13 -106 2 -196 5 -201
7 -4 2 -5 8 -2 13 4 5 91 9 201 9 170 0 194 -2 194 -16z m-630 -353 l0 -131
-172 0 c-149 0 -216 8 -198 23 3 2 86 50 185 105 l180 102 -197 0 c-176 0
-211 4 -193 21 2 3 92 6 200 8 l195 2 0 -130z m630 114 c0 -13 -28 -15 -194
-15 -177 0 -218 5 -199 24 3 3 93 6 200 6 165 0 193 -2 193 -15z m-300 -65
c25 -15 68 -40 96 -55 27 -15 77 -43 112 -62 35 -19 61 -40 59 -47 -2 -7 -59
-12 -180 -14 l-177 -2 0 110 c0 127 -3 125 90 70z m-604 10 c55 0 93 -4 90 -9
-4 -5 -37 -26 -74 -47 -37 -20 -82 -48 -101 -62 -41 -31 -51 -20 -51 59 0 59
6 73 28 64 7 -3 56 -5 108 -5z m914 -70 c0 -78 -6 -83 -52 -44 -17 14 -52 36
-77 49 -25 12 -57 32 -71 44 l-25 20 113 1 112 0 0 -70z"/>
<path d="M700 1200 c0 -66 3 -120 6 -120 59 0 331 -56 439 -91 108 -35 299
-128 362 -176 25 -19 51 -32 59 -29 8 3 53 28 100 56 194 115 440 197 669 225
28 4 62 9 78 11 l27 6 0 120 0 120 -67 -7 c-269 -27 -569 -113 -743 -213 l-65
-38 -65 38 c-184 107 -450 183 -737 213 l-63 6 0 -121z m267 44 c171 -31 341
-88 490 -166 50 -26 99 -48 109 -48 9 0 49 17 88 39 104 56 243 108 390 146
129 32 331 64 342 53 9 -10 12 -122 4 -139 -6 -11 -37 -20 -97 -28 -117 -17
-291 -62 -389 -101 -43 -17 -139 -63 -212 -101 l-133 -69 -72 43 c-190 116
-386 187 -612 222 -146 23 -135 16 -135 94 0 37 3 71 8 75 9 9 108 0 219 -20z"/>
<path d="M700 901 c0 -28 1 -28 68 -34 242 -21 517 -115 710 -244 69 -45 88
-54 101 -45 111 78 268 159 388 200 131 45 352 92 434 92 37 0 39 2 39 30 0
35 2 35 -128 15 -279 -44 -486 -116 -671 -235 l-80 -52 -33 25 c-105 78 -317
176 -473 217 -71 19 -305 60 -341 60 -9 0 -14 -11 -14 -29z"/>
</g>
</svg>

```

--- Archivo: /src/environments/environment.prod.ts ---

```ts
export const environment = {
  production: true,
  apiUrl: 'https://tuservidor.com/api'
};

```

--- Archivo: /src/environments/environment.ts ---

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:4000/api'
};

```

--- Archivo: /src/index.html ---

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Bases</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>

```

--- Archivo: /src/main.ts ---

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes as appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimations(), // 👈 Necesario para PrimeNG (soluciona NG05105)
  ],
}).catch(err => console.error(err));

```

--- Archivo: /src/styles.css ---

```css

/* ===== Paleta (azules / negro / blanco) ===== */
:root {
  /* Marca */
  --brand-900: #0B1220; /* casi negro azulado */
  --brand-800: #0F172A; /* slate oscuro */
  --brand-700: #1E293B; /* slate medio */
  --brand-600: #1D4ED8; /* azul intenso */
  --brand-500: #2563EB; /* azul principal */
  --brand-400: #60A5FA; /* azul claro para hovers */
  --brand-300: #93C5FD; /* azul muy claro */

  /* Superficies y texto */
  --surface-0: #FFFFFF; /* blanco */
  --surface-1: #F7FAFC; /* gris casi blanco */
  --surface-2: #EEF2F7; /* gris claro para separar secciones */
  --text-900: #0B1220;
  --text-700: #334155;

  /* Accesibilidad (borde/foco) */
  --focus: #60A5FA;

  /* Gradientes / decor */
  --grad-header: linear-gradient(135deg, var(--brand-900), var(--brand-800) 60%, var(--brand-700));
  --grad-cta: linear-gradient(135deg, var(--brand-600), var(--brand-500));
}

/* ===== Modo oscuro opcional (actívalo con <html data-theme="dark">) ===== */
:root[data-theme="dark"] {
  --surface-0: #0B1220;
  --surface-1: #0F172A;
  --surface-2: #111827;
  --text-900: #E5E7EB;
  --text-700: #CBD5E1;
  --grad-header: linear-gradient(135deg, #0B1220, #0F172A 60%, #1E293B);
}

/* ===== Reset / base ===== */
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  background: var(--surface-1);
  color: var(--text-900);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Utilidades ===== */
.container { width: min(1200px,88vw); margin-inline: auto; }
.elev-1 { box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }
.round { border-radius: 12px; }

/* Botones base */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: .5rem; padding: .75rem 1.25rem; border-radius: 10px;
  font-weight: 600; text-decoration: none; cursor: pointer;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
  border: 1px solid transparent;
}
.btn:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }

/* Botón primario (azul, moderno con gradiente) */
.btn-primary {
  color: #fff; background: var(--grad-cta);
  box-shadow: 0 8px 24px rgba(37, 99, 235, .25);
}
.btn-primary:hover { transform: translateY(-2px); }

/* Botón borde (azul suave) */
.btn-outline {
  background: transparent; color: var(--brand-600); border-color: var(--brand-300);
}
.btn-outline:hover { background: rgba(96, 165, 250, .12); }

/* Botón fantasma (texto azul) */
.btn-ghost {
  background: transparent; color: var(--brand-500);
}
.btn-ghost:hover { background: rgba(96, 165, 250, .08); }


/* === Searchbar - variables y ajustes globales (añadir al final) === */

/* Halo de enfoque accesible y borde coherente con la paleta */
:root {
  --search-border: #E5E7EB;
  --search-placeholder: #9CA3AF;
  --search-icon: var(--text-700);
  --search-focus-ring: rgba(96, 165, 250, .25); /* a partir de --brand-400 */
}

/* Modo oscuro */
:root[data-theme="dark"] {
  --search-border: #1F2937;
  --search-placeholder: #94A3B8;
  --search-icon: var(--text-700);
  --search-focus-ring: rgba(96, 165, 250, .28);
}

/* Reset suave para inputs PrimeNG dentro de nuestro contenedor */
.search-input.p-inputtext,
.search-input {
  border: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  color: var(--text-900);
}
.search-input::placeholder { color: var(--search-placeholder); }

/* Botón limpiar (PrimeNG) */
.searchbar__clear.p-button {
  border: 0;
  background: transparent;
  color: var(--search-placeholder);
  padding: 0 .6rem;
  transition: color .15s ease, background .15s ease;
}
.searchbar__clear.p-button:hover {
  background: rgba(96, 165, 250, .10);
  color: var(--brand-600);
}

/* Icono izquierdo */
.searchbar__icon {
  background: transparent;
  border: 0 !important;
  color: var(--search-icon);
  padding-inline: .9rem;
  display: inline-flex;
  align-items: center;
}


.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-900);
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--surface-2);
  padding-bottom: 10px;
}

.admin-view.container{
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--surface-1);
}

.btn-reverse {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-weight: 600;
    border: 2px solid var(--brand-500);
    border-radius: 8px;
    color: var(--brand-500);
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
}

.btn-reverse:hover {
    background-color: var(--brand-500);
    color: #fff;
}



/* --- INICIO: ESTILOS PERSONALIZADOS PARA p-toast --- */
/* Esto va en styles.css (global) porque p-toast se
  renderiza en el <body>, fuera del componente.
*/

/* Variables de color para los toasts */
:root {
  --toast-success-color: #00d68f;
  --toast-success-text-color: #027A48; /* Verde oscuro (legible) */
  --toast-error-color: #ff3d71;
  --toast-error-text-color: #D92D20; /* Rojo oscuro (legible) */
}

/* Base común para todos los toasts */
.p-toast-message {
  background: var(--ngx-bg) !important;
  border: 1px solid var(--surface-2);
  border-left-width: 6px;
  border-radius: 8px;
  /* Sombra más fuerte para que "resalte" más (soluciona "no se ve bien") */
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.12);
}
.p-toast-message-content {
  padding: 0.6rem 0.8rem !important;
}
.p-toast-message .p-toast-summary {
  font-size: 1rem;
  font-weight: 600;
}
.p-toast-message .p-toast-detail {
  font-weight: 500;
  margin-top: 0.25rem;
}
.p-toast-message .p-toast-close-icon {
  color: var(--text-700);
  transition: background-color 0.2s ease;
  border-radius: 50%;
}

/* --- 1. ESTILOS INFO (Azul) --- */
.p-toast-message-info {
  border-color: var(--brand-300);
  border-left-color: var(--brand-500); /* Acento azul principal */
}
/* Icono y Título en azul intenso */
.p-toast-message-info .p-toast-message-icon,
.p-toast-message-info .p-toast-summary {
  color: var(--brand-600);
}
/* Detalle en azul (como pediste "todo el texto en azul") */
.p-toast-message-info .p-toast-detail {
  color: var(--brand-500);
}
.p-toast-message-info .p-toast-close-icon:hover {
   background: rgba(96, 165, 250, .10); /* Hover azul claro */
   color: var(--brand-600);
}

/* --- 2. ESTILOS ERROR (Rojo) --- */
.p-toast-message-error {
  border-color: #FECDCA; /* Rojo claro */
  border-left-color: var(--toast-error-color);
}
/* Icono y Título en rojo vivo */
.p-toast-message-error .p-toast-message-icon,
.p-toast-message-error .p-toast-summary {
  color: var(--toast-error-color);
}
/* Detalle en rojo oscuro (como pediste "todo el texto en rojo") */
.p-toast-message-error .p-toast-detail {
  color: var(--toast-error-text-color);
}
.p-toast-message-error .p-toast-close-icon:hover {
   background: rgba(255, 61, 113, .10); /* Hover rojo claro */
   color: var(--toast-error-color);
}

/* --- 3. ESTILOS SUCCESS (Verde) --- */
.p-toast-message-success {
  border-color: #A6F4C5; /* Verde claro */
  border-left-color: var(--toast-success-color);
}
.p-toast-message-success .p-toast-message-icon,
.p-toast-message-success .p-toast-summary {
  color: var(--toast-success-color);
}
.p-toast-message-success .p-toast-detail {
  color: var(--toast-success-text-color);
}
.p-toast-message-success .p-toast-close-icon:hover {
   background: rgba(0, 214, 143, .10); /* Hover verde claro */
   color: var(--toast-success-color);
}

/* --- FIN: ESTILOS PERSONALIZADOS PARA p-toast --- */

```

