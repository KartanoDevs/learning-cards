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
