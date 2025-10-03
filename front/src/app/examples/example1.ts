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
