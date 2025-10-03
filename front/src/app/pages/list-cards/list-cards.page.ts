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
