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
