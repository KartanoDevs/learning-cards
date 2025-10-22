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

