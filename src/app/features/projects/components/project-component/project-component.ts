import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project-service';

@Component({
  selector: 'app-project-component',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {
  private projectService = inject(ProjectService);
  projects = this.projectService.projects; // Signal from service
  displayedColumns = ['name', 'description', 'actions'] as const;

  deleteProject(id: string): void {
    if (confirm('Delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => console.log('Deleted'),
        error: err => console.error('Delete failed', err)
      });
    }
  }
}
