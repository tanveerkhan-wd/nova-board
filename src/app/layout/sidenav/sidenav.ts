import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../features/projects/services/project-service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  private projectService = inject(ProjectService);
  
  projects = this.projectService.projects;
  searchQuery = signal('');
  projectsCollapsed = signal(false);

  filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.projects().filter(p => p.name.toLowerCase().includes(query));
  });

  toggleProjects() {
    this.projectsCollapsed.update(v => !v);
  }
}
