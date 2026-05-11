import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../services/project-service';
import { ButtonComponent } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonComponent
  ],
  template: `
    <div class="p-6 max-w-md bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
      <h2 mat-dialog-title class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create New Project</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the details for your new project to get started.</p>

      <form (ngSubmit)="onSubmit()" #projectForm="ngForm">
        <mat-form-field appearance="outline" class="w-full mb-4">
          <mat-label>Project Name</mat-label>
          <input
            matInput
            [(ngModel)]="name"
            name="name"
            required
            placeholder="e.g. Website Redesign"
            autocomplete="off"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full mb-6">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            name="description"
            placeholder="What is this project about?"
            rows="3"
          ></textarea>
        </mat-form-field>

        <div class="flex justify-end space-x-3">
          <app-button variant="ghost" (btnClick)="onCancel()" [disabled]="loading()">
            Cancel
          </app-button>
          <app-button
            type="submit"
            [loading]="loading()"
            [disabled]="!projectForm.valid"
          >
            Create Project
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .mat-mdc-form-field {
      display: block;
    }
  `]
})
export class CreateProjectComponent {
  private projectService = inject(ProjectService);
  private dialogRef = inject(MatDialogRef<CreateProjectComponent>);

  name = '';
  description = '';
  loading = signal(false);

  onSubmit() {
    if (!this.name) return;

    this.loading.set(true);
    this.projectService.createProject({
      name: this.name,
      description: this.description,
      owner_id: '' // This will likely be handled by a trigger or should be the current user
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Create project failed', err);
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
