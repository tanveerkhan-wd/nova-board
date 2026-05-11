import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../services/project-service';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { CreateProjectComponent } from '../create-project/create-project';

@Component({
  selector: 'app-project-component',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, ButtonComponent, MatDialogModule],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);
  projects = this.projectService.projects; // Signal from service
  displayedColumns = ['name', 'description', 'actions'] as const;

  openCreateProjectModal(): void {
    this.dialog.open(CreateProjectComponent, {
      width: '450px',
      maxWidth: '90vw',
      panelClass: 'create-project-dialog'
    });
  }

  deleteProject(id: string): void {
    if (confirm('Delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => console.log('Deleted'),
        error: err => console.error('Delete failed', err)
      });
    }
  }
}
