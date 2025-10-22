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
