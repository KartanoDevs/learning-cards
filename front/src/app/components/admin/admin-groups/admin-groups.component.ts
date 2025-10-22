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
