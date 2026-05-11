import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../../tasks/services/task-service';
import { Task, TaskStatus } from '../../../../shared/interfaces/database.interface';
import { BoardColumnComponent } from '../board-column/board-column';
import { TaskDetailComponent } from '../../../tasks/components/task-detail/task-detail';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, BoardColumnComponent, MatDialogModule],
  template: `
    <div class="h-full flex flex-col p-6">
      <header class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-text-dark dark:text-gray-100">Project Board</h1>
          <p class="text-sm text-text-dark/70 dark:text-gray-400">Manage and track your project tasks.</p>
        </div>
        <button (click)="createTask()" class="bg-jira-blue hover:bg-jira-blue/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          Create Task
        </button>
      </header>

      <!-- Board Columns -->
      <div 
        cdkDropListGroup 
        class="flex-1 flex space-x-4 overflow-x-auto pb-4 items-start"
      >
        @for (column of columns; track column.status) {
          <app-board-column
            [title]="column.title"
            [status]="column.status"
            [tasks]="getTasksByStatus(column.status)"
            (dropped)="onTaskDrop($event, column.status)"
            (taskOpened)="openTaskDetail($event)"
          ></app-board-column>
        }
      </div>
    </div>
  `,
  styles: []
})
export class KanbanBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  projectId = signal<string | null>(null);
  allTasks = this.taskService.tasks;

  columns: { title: string; status: TaskStatus }[] = [
    { title: 'Backlog', status: 'Backlog' },
    { title: 'To Do', status: 'To Do' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'Review', status: 'Review' },
    { title: 'Done', status: 'Done' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.projectId.set(id);
        this.taskService.loadTasks(id);
      }
    });
  }

  getTasksByStatus(status: TaskStatus) {
    return this.allTasks().filter(t => t.status === status);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    const task = event.item.data as Task;
    const previousStatus = task.status;

    if (event.previousContainer === event.container) {
      // Reordering within the same column
      if (event.previousIndex === event.currentIndex) return;
      
      const columnTasks = [...this.getTasksByStatus(newStatus)];
      moveItemInArray(columnTasks, event.previousIndex, event.currentIndex);
      this.calculateAndSavePosition(task, columnTasks, event.currentIndex, newStatus);
    } else {
      // Moving to a different column
      const previousColumnTasks = [...this.getTasksByStatus(previousStatus)];
      const targetColumnTasks = [...this.getTasksByStatus(newStatus)];
      
      transferArrayItem(
        previousColumnTasks,
        targetColumnTasks,
        event.previousIndex,
        event.currentIndex
      );
      this.calculateAndSavePosition(task, targetColumnTasks, event.currentIndex, newStatus);
    }
  }

  private async calculateAndSavePosition(task: Task, columnTasks: Task[], newIndex: number, newStatus: TaskStatus) {
    const prevTask = columnTasks[newIndex - 1];
    const nextTask = columnTasks[newIndex + 1];

    let newPosition: number;

    if (!prevTask && !nextTask) {
      newPosition = 10000;
    } else if (!prevTask) {
      newPosition = nextTask.position / 2;
    } else if (!nextTask) {
      newPosition = prevTask.position + 10000;
    } else {
      newPosition = (prevTask.position + nextTask.position) / 2;
    }

    try {
      await this.taskService.updateTaskPosition(task.id, newPosition, newStatus);
    } catch (err) {
      console.error('Failed to update task position', err);
      // Real-time subscription will eventually revert the UI state if needed
    }
  }

  openTaskDetail(task: Task) {
    this.dialog.open(TaskDetailComponent, {
      data: { ...task },
      maxWidth: 'none',
      panelClass: 'task-detail-dialog'
    });
  }

  async createTask() {
    const pid = this.projectId();
    if (!pid) return;

    const title = prompt('Enter task title:');
    if (!title) return;

    const user = this.authService.user();
    if (!user) {
      alert('You must be logged in to create a task.');
      return;
    }

    const columnTasks = this.getTasksByStatus('Backlog');
    const lastTask = columnTasks[columnTasks.length - 1];
    const position = lastTask ? lastTask.position + 10000 : 10000;

    await this.taskService.createTask({
      project_id: pid,
      title,
      status: 'Backlog',
      priority: 'Medium',
      reporter_id: user.id,
      position: position,
      description: '',
      assignee_id: null,
      due_date: null,
      labels: []
    });
  }
}
