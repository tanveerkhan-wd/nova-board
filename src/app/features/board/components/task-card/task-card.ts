import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared/interfaces/database.interface';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      (click)="open.emit(task)"
      class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all group"
    >
      <div class="flex items-start justify-between mb-3">
        <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ task.title }}
        </h4>
      </div>
      
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center space-x-2">
          <span [class]="priorityClass" class="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.1em] border">
            {{ task.priority }}
          </span>
          @if (task.labels && task.labels.length > 0) {
            <span class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              +{{ task.labels.length }}
            </span>
          }
        </div>
        
        <div class="flex -space-x-2">
          <div class="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] text-blue-600 dark:text-blue-400 font-black shadow-sm">
            {{ task.assignee_id ? 'AS' : '?' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() open = new EventEmitter<Task>();

  get priorityClass() {
    switch (this.task.priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  }
}
