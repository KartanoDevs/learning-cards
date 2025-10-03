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
