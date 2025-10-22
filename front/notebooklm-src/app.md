# app

> Generado desde: `C:\Users\Kartano\Desktop\Programación\AlejandroGit\learning-cards\front\src/app`


## File: `app/api/cards.service.ts`

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

## File: `app/api/groups.service.ts`

```ts
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

```

## File: `app/api/models.ts`

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
  slug: string;
  iconUrl?: string | null;
  order?: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
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

## File: `app/app.component.css`

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

## File: `app/app.component.html`

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

## File: `app/app.component.ts`

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

## File: `app/app.config.ts`

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

## File: `app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { ListGroupsPage } from './pages/list-groups/list-groups.page';
import { ListCardsComponent } from './pages/list-cards/list-cards.page';

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
    path: 'list-cards/:id',   // 👈 nueva ruta
    component: ListCardsComponent
  },

  {
    path: '**',
    redirectTo: 'list-groups'
  }

];

```

## File: `app/components/main/card/card-view.component.css`

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

## File: `app/components/main/card/card-view.component.html`

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

## File: `app/components/main/card/card-view.component.ts`

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

## File: `app/components/main/card/card.component.css`

```css
/* Centrado a pantalla completa */
.card-center {
  min-height: 100dvh; /* usa 100vh si prefieres */
  display: grid;
  place-items: center;
}

html, body {
  height: 100%;
  margin: 0;
}

/* Tarjeta con efecto flip */
.card {
  margin-inline: auto;
  display: block;
  width: 25vw;
  height: 25vw;
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
  /* background: #000; */
  overflow: hidden;
  color: #fff;
}

/* Cara frontal */
.card-front {
  display: flex;
  justify-content: center;
  color:var(--brand-700);
  /* background-color: var(--brand-400); */
}

/* Cara trasera → grid: heading centrado + iconos abajo */
.card-back {
  transform: rotateY(180deg);
  padding: 20px;
  display: grid;
  grid-template-rows: 1fr auto; /* centra heading, iconos al fondo */
  justify-items: center;
  text-align: center;
}

.card-back .heading {
  align-self: center; /* texto centrado verticalmente */
}

.card-back .subtext,
.card-back .icon-row {
  align-self: end; /* pegado abajo */
  margin-top: 0;
}

/* Fondos gradientes */
.card-front::before,
.card-back::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(-45deg, var(--brand-800) 0%, var(--brand-300) 100%);
  z-index: -1;
}

.card-front::after,
.card-back::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(-45deg, var(--brand-300) 0%, var(--brand-300) 100%);
  filter: blur(20px);
  z-index: -2;
}

/* Texto */
.heading {
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 800;
  text-align: center;
  margin: 0;
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
  margin-top: .5rem;
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
  transition: background-color .15s ease, color .15s ease, box-shadow .2s ease, transform .12s ease, opacity .12s ease;
}

.hover-fill:hover {
  background-color: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
}

.hover-ring { position: relative; }
.hover-ring::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 16px;
  pointer-events: none;
  box-shadow: 0 0 0 0 rgba(0,0,0,0);
  transition: box-shadow .2s ease;
}
.hover-ring:hover::after {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}

.action-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59,130,246,.25), 0 0 0 1.5px var(--accent) inset;
}
.action-btn:active { transform: translateY(1px); }

@media (prefers-reduced-motion: reduce) {
  .action-btn { transition: none; }
  .action-btn:active { transform: none; }
}

/* Responsive */
@media (max-width: 640px) {
  .card { width: min(80vw, 360px); height: min(80vw, 360px); }
}

```

## File: `app/components/main/card/card.component.html`

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
      <p class="heading">{{ frontText }}</p>
    </div>

    <div class="card-back">
      <p class="heading">{{ backText }}</p>

      <div class="subtext icon-row">
        <span
          class="pi pi-image action-btn hover-fill hover-ring"
          role="button" tabindex="0" aria-label="Abrir imagen"
          (click)="onOpenImage($event)"
          (keydown.enter)="onOpenImage($event)"
          (keydown.space)="onOpenImage($event); $event.preventDefault()"
          [class.disabled]="!card?.imageUrl"
          title="Abrir imagen">
        </span>

        <span
          class="pi pi-volume-up action-btn hover-fill hover-ring"
          role="button" tabindex="0" aria-label="Reproducir sonido"
          (click)="onOpenSound($event)"
          (keydown.enter)="onOpenSound($event)"
          (keydown.space)="onOpenSound($event); $event.preventDefault()"
          title="Reproducir sonido">
        </span>
      </div>
    </div>
  </div>
</div>

```

## File: `app/components/main/card/card.component.ts`

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
  @Output() openImage = new EventEmitter<string | null>();
  @Output() openSound = new EventEmitter<string>();

  flipped = false;

  get frontText(): string {
    return this.card?.english ?? '';
  }
  get backText(): string {
    return this.card?.spanish ?? '';
  }

  toggleFlip() { this.flipped = !this.flipped; }

  onOpenImage(ev: Event) {
    ev.stopPropagation();
    this.openImage.emit(this.card?.imageUrl ?? null);
  }

  onOpenSound(ev: Event) {
    ev.stopPropagation();
    const text = this.frontText || '';
    this.openSound.emit(text);
  }
}

```

## File: `app/components/shared/footer/footer.component.css`

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

## File: `app/components/shared/footer/footer.component.html`

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

## File: `app/components/shared/footer/footer.component.ts`

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

## File: `app/components/shared/header/header.component.css`

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

## File: `app/components/shared/header/header.component.html`

```html
<header class="site-header">
  <div class="container header-inner">
    <a routerLink="/" class="brand">
      <img src="assets/logo.svg" alt="Logo" class="logo" />
      <span>Alex Galán </span>
    </a>

    <nav class="nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Temas /Grupos tarjetas</a>
      <a routerLink="/cursos" routerLinkActive="active">Administración</a>
      <a routerLink="/contacto" routerLinkActive="active">Miau</a>
    </nav>

    <!-- CTA opcional -->
    <!-- <a routerLink="/inscripcion" class="btn btn-primary hide-sm">Inscribirme</a> -->
  </div>
</header>

```

## File: `app/components/shared/header/header.component.ts`

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

## File: `app/examples/example1.ts`

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
    this.groupsApi.list().subscribe(groups => {
      const first = groups[0];
      if (!first) return;
      this.cardsApi.list({ groupId: first._id, page: 1, limit: 20, enabled: true })
        .subscribe(({ data }) => this.cards = data);
    });
  }
}

```

## File: `app/pages/list-cards/list-cards.page.css`

```css
.list-cards-wrapper { display: grid; gap: 1rem; }
.loading-box { display: grid; place-items: center; min-height: 8rem; }
.cards-grid { margin-top: .5rem; }
.empty { opacity: .7; text-align: center; }
.paginator-box { display: flex; justify-content: center; margin: .5rem 0 1.5rem; }

.cards-wrap {
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
.state.empty { color: #64748b; }

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
  background: var(--brand-400);     /* 👈 color azul al pasar el ratón */
  color: #fff;             /* texto/icono blanco */
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
.sep { color: #94a3b8; }
.count { color: #334155; }

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
  background: var(--brand-400);   /* 👈 color azul al hover */
  color: #fff;           /* texto blanco */
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

## File: `app/pages/list-cards/list-cards.page.html`

```html
<section class="cards-wrap">
  <div *ngIf="loading" class="state">
    <p-progressSpinner styleClass="w-3rem h-3rem"></p-progressSpinner>
  </div>

  <p-message *ngIf="!loading && error" severity="error" [text]="error"></p-message>

  <ng-container *ngIf="!loading && !error">
    <ng-container *ngIf="cards.length; else empty">
      <!-- Tarjeta (el servidor ya aplica reverse si corresponde) -->
      <app-card
        [card]="cards[0]"
        (openImage)="openImageInModal($event)"
      ></app-card>

      <!-- ===== Barra de navegación con flechas ===== -->
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
          <span class="page-chip">Registro {{ currentPage }} de {{ totalPages }}</span>
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

      <!-- Controles de consulta -->
      <div class="controls">
        <button type="button" class="btn" (click)="toggleShuffle()">
          {{ shuffle ? 'Quitar Shuffle' : 'Shuffle' }}
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

  <!-- ===== Modal de imagen ===== -->
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

## File: `app/pages/list-cards/list-cards.page.ts`

```ts
import { Card } from './../../api/models';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

import { BehaviorSubject, Subject, combineLatest, switchMap, map, catchError, of, takeUntil } from 'rxjs';
import { CardsService } from '../../api/cards.service';
import type { PaginationMeta } from './../../api/models';
import { CardComponent } from '../../components/main/card/card.component';

@Component({
  selector: 'app-list-cards',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, MessageModule, DialogModule, CardComponent],
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

  readonly limit = 1; // una tarjeta por página

  // estado de consulta (lo manda al servidor)
  private page$ = new BehaviorSubject<number>(1);      // 1-based
  private shuffle$ = new BehaviorSubject<boolean>(false);
  private reverse$ = new BehaviorSubject<boolean>(false);

  get page()    { return this.page$.value; }
  get shuffle() { return this.shuffle$.value; }
  get reverse() { return this.reverse$.value; }

  // ===== Modal de imagen =====
  showImage = false;
  modalImageUrl: string | null = null;

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap.pipe(map(pm => pm.get('id') ?? '')),
      this.page$,
      this.shuffle$,
      this.reverse$,
    ])
    .pipe(
      switchMap(([id, page, shuffle, reverse]) => {
        this.groupId = id;
        this.loading = true;
        this.error = null;

        return this.cardsSrv.list({
          groupId: id,
          enabled: true,
          page,
          limit: this.limit,
          shuffle,   // backend baraja
          reverse,   // backend invierte english/spanish en la respuesta
        }).pipe(
          catchError(err => {
            console.error(err);
            this.error = 'No se pudieron cargar las tarjetas.';
            const fallbackMeta: PaginationMeta = { total: 0, page, limit: this.limit, pages: 0 };
            return of({ data: [] as Card[], meta: fallbackMeta });
          })
        );
      }),
      takeUntil(this.destroy$)
    )
    .subscribe(({ data, meta }) => {
      this.cards = data ?? [];
      this.meta = meta ?? { total: 0, page: this.page, limit: this.limit, pages: 0 };
      this.loading = false;
    });
  }

  // ===== Navegación personalizada (flechas) =====
  get totalRecords(): number {
    return this.meta?.total ?? 0;
  }
  get totalPages(): number {
    const t = this.totalRecords;
    return t > 0 ? Math.ceil(t / this.limit) : 0;
  }
  get currentPage(): number {
    return this.meta?.page ?? this.page;
  }
  get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }
  get isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }
  get currentIndex(): number {
    // 1 tarjeta por página → índice visible == página actual
    return Math.min(this.currentPage, this.totalRecords || 0);
  }

  goPrev() {
    if (!this.isFirstPage) this.page$.next(this.currentPage - 1);
  }
  goNext() {
    if (!this.isLastPage) this.page$.next(this.currentPage + 1);
  }

  // ===== Controles de consulta =====
  toggleShuffle() {
    this.shuffle$.next(!this.shuffle);
    this.page$.next(1);
  }

  toggleReverse() {
    this.reverse$.next(!this.reverse);
    this.page$.next(1);
  }

  // ===== Modal imagen =====
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

## File: `app/pages/list-groups/list-groups.page.css`

```css
:root {
  --brand: #388fed;
  --brand-10: rgba(56, 143, 237, 0.1);
  --text: #0f172a;
  --muted: #64748b;
  --bg: #f8fafc;
  --white: #ffffff;
  --radius: 14px;
  --shadow: 0 6px 20px rgba(2, 8, 23, 0.06);
}

.wrapper {
  max-width: 980px;
  margin: 0 auto;
  padding: 1.25rem;
}

.header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.search {
  position: relative;
  min-width: 260px;
  flex: 1 1 320px;
}

.icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.7;
  font-size: 0.95rem;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  background: var(--white);
  transition: border-color 0.2s ease;
}
.search-input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-10);
}

.state {
  display: grid;
  place-items: center;
  padding: 2rem 0;
  color: var(--muted);
}
.state.error { color: #dc2626; }
.state.empty { color: var(--muted); }

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.group-btn {
  display: block;
  width: 100%;
  background: var(--white);
  border: 2px solid var(--brand);
  color: var(--text);
  border-radius: var(--radius);
  padding: 14px 14px;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.08s ease, box-shadow 0.2s ease, background 0.2s ease;
  text-align: left;
}
.group-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(2, 8, 23, 0.08);
  background: linear-gradient(0deg, var(--brand-10), var(--white));
}
.group-btn:active {
  transform: translateY(0);
}

.group-btn__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-btn__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.group-btn__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.group-btn__name {
  font-weight: 700;
  line-height: 1.15;
}
.group-btn__slug {
  font-size: 0.8rem;
  color: var(--muted);
}

```

## File: `app/pages/list-groups/list-groups.page.html`

```html
<section class="wrapper">
  <header class="header">
    <h2 class="title">Grupos</h2>

    <div class="search">
      <span class="icon">🔎</span>
      <input
        type="text"
        placeholder="Buscar grupo..."
        [(ngModel)]="search"
        class="search-input"
        aria-label="Buscar grupo"
      />
    </div>
  </header>

  <div *ngIf="loading" class="state">
    <div class="spinner" aria-label="Cargando"></div>
  </div>

  <div *ngIf="!loading && errorMsg" class="state error">
    {{ errorMsg }}
  </div>

  <div *ngIf="!loading && !errorMsg">
    <div *ngIf="filtered.length === 0" class="state empty">
      No hay grupos para mostrar.
    </div>

    <div class="grid">
      <button
        *ngFor="let g of filtered; trackBy: trackById"
        type="button"
        class="group-btn"
        (click)="go(g)"
        [title]="g.slug || g.name"
      >
        <div class="group-btn__content">
          <img
            *ngIf="g.iconUrl"
            [src]="g.iconUrl"
            alt=""
            class="group-btn__icon"
            loading="lazy"
          />
          <div class="group-btn__text">
            <span class="group-btn__name">{{ g.name }}</span>
            <span class="group-btn__slug" *ngIf="g.slug">{{ g.slug }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</section>

```

## File: `app/pages/list-groups/list-groups.page.ts`

```ts
import { Group } from './../../api/models';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupsService } from '../../api/groups.service';
@Component({
  selector: 'app-list-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-groups.page.html',
  styleUrls: ['./list-groups.page.css'],
})
export class ListGroupsPage implements OnInit {
  private groupsSvc = inject(GroupsService);
  private router = inject(Router);

  search = '';
  loading = true;
  groups: Group[] = [];
  errorMsg = '';

  ngOnInit(): void {
    this.fetch();
  }

  async fetch() {
    this.loading = true;
    this.errorMsg = '';
    try {
      const data = await this.groupsSvc.list({ enabled: true }).toPromise();
      // 🔧 Evita duplicados por _id
      const uniqueMap = new Map<string, Group>();
      (data ?? []).forEach((g) => uniqueMap.set(g._id, g));
      this.groups = Array.from(uniqueMap.values()).sort(
        (a, b) =>
          (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
      );
    } catch (e: any) {
      this.errorMsg = e?.message || 'Error cargando grupos';
    } finally {
      this.loading = false;
    }
  }

  // Lista filtrada (cliente)
  get filtered(): Group[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.groups;
    return this.groups.filter(
      (g) =>
        (g.name ?? '').toLowerCase().includes(q) ||
        (g.slug ?? '').toLowerCase().includes(q)
    );
  }

  trackById(_i: number, g: Group) {
    return g._id;
  }

  go(g: Group) {
    if (!g?._id) return;
    this.router.navigate(['/list-cards', g._id]);
  }
}

```

## File: `app/services/theme.service.ts`

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

## File: `app/topics/topics.component.css`

```css

```

## File: `app/topics/topics.component.html`

```html
<p>topics works!</p>

```

## File: `app/topics/topics.component.ts`

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
