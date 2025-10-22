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

