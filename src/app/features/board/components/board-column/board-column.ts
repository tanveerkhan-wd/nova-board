import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../../../shared/interfaces/database.interface';
import { TaskCardComponent } from '../task-card/task-card';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  template: `
    <div class="flex flex-col h-full bg-neutral-100 dark:bg-gray-900/50 rounded-lg border border-neutral-300 dark:border-gray-800 w-72">
      <!-- Column Header -->
      <div class="p-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h3 class="text-sm font-semibold text-text-dark dark:text-gray-300 uppercase tracking-wider">
          {{ title }}
        </h3>
        <span class="bg-neutral-300 dark:bg-gray-800 text-text-dark/70 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {{ tasks.length }}
        </span>
      </div>

      <!-- Task List Container -->
      <div
        cdkDropList
        [cdkDropListData]="tasks"
        (cdkDropListDropped)="onDrop($event)"
        class="flex-1 p-2 space-y-2 overflow-y-auto min-h-[100px]"
      >
        @for (task of tasks; track task.id) {
          <app-task-card [task]="task" (open)="taskOpened.emit($event)" cdkDrag [cdkDragData]="task"></app-task-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drag-animating {
      transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
  `]
})
export class BoardColumnComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) status!: TaskStatus;
  @Input({ required: true }) tasks: Task[] = [];
  
  @Output() dropped = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() taskOpened = new EventEmitter<Task>();

  onDrop(event: CdkDragDrop<Task[]>) {
    this.dropped.emit(event);
  }
}
