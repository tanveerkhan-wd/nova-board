import { Component, Inject, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/interfaces/database.interface';
import { TaskService } from '../../services/task-service';
import { CommentService } from '../../services/comment-service';
import { MemberService } from '../../../projects/services/member-service';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, TiptapEditorDirective],
  template: `
    <div class="flex flex-col h-[90vh] max-h-[800px] w-[90vw] max-w-[900px] bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-2xl">
      <!-- Header -->
      <header class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
        <div class="flex items-center space-x-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          <span class="hover:underline cursor-pointer">Project</span>
          <span>/</span>
          <span class="text-blue-600 dark:text-blue-400">TASK-{{ task.id.slice(0, 4) }}</span>
        </div>
        <div class="flex items-center space-x-2">
           <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button (click)="close()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12">
        <!-- Main Content -->
        <div class="flex-1 space-y-8">
          <div>
            <input 
              [(ngModel)]="task.title" 
              (blur)="updateTask({ title: task.title })"
              class="text-3xl font-extrabold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 -ml-2 w-full text-gray-900 dark:text-white"
              placeholder="Task title"
            >
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </h3>
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
               <tiptap-editor [editor]="editor" [(ngModel)]="task.description" (blur)="updateTask({ description: task.description })"></tiptap-editor>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="space-y-6 pt-8 border-t border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Activity
            </h3>
            
            <div class="space-y-6">
              @for (comment of comments(); track comment.id) {
                <div class="flex space-x-4 group">
                  <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-black shadow-sm flex-shrink-0">
                    {{ comment.profiles?.full_name?.slice(0, 2).toUpperCase() || 'U' }}
                  </div>
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-bold text-gray-900 dark:text-white">{{ comment.profiles?.full_name }}</span>
                      <span class="text-[10px] text-gray-400 font-medium">{{ comment.created_at | date:'medium' }}</span>
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl" [innerHTML]="comment.content"></div>
                    <div class="flex items-center space-x-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="text-[10px] font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest">Edit</button>
                      <button class="text-[10px] font-bold text-gray-500 hover:text-red-600 uppercase tracking-widest">Delete</button>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- New Comment -->
            <div class="flex space-x-4 mt-8 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div class="h-10 w-10 rounded-full bg-blue-600 shadow-md flex items-center justify-center text-white text-xs font-black flex-shrink-0">ME</div>
              <div class="flex-1 space-y-4">
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                   <tiptap-editor [editor]="commentEditor" [(ngModel)]="newComment"></tiptap-editor>
                </div>
                <div class="flex justify-end">
                  <button 
                    (click)="addComment()"
                    [disabled]="!newComment"
                    class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-95 shadow-md shadow-blue-500/20"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Details -->
        <div class="w-full md:w-72 space-y-8">
          <div class="space-y-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div>
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 block">Status</label>
              <select 
                [(ngModel)]="task.status" 
                (change)="updateTask({ status: task.status })"
                class="block w-full px-4 py-2.5 text-sm font-bold border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-all cursor-pointer"
              >
                @for (status of statuses; track status) {
                  <option [value]="status">{{ status }}</option>
                }
              </select>
            </div>

            <div>
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 block">Priority</label>
              <select 
                [(ngModel)]="task.priority" 
                (change)="updateTask({ priority: task.priority })"
                class="block w-full px-4 py-2.5 text-sm font-bold border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-all cursor-pointer"
              >
                @for (priority of priorities; track priority) {
                  <option [value]="priority">{{ priority }}</option>
                }
              </select>
            </div>

            <div>
              <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 block">Assignee</label>
              <select 
                [(ngModel)]="task.assignee_id" 
                (change)="updateTask({ assignee_id: task.assignee_id })"
                class="block w-full px-4 py-2.5 text-sm font-bold border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-all cursor-pointer"
              >
                <option [value]="null">Unassigned</option>
                @for (member of members(); track member.id) {
                  <option [value]="member.id">{{ member.full_name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="px-2 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reporter</span>
              <span class="text-xs font-bold text-gray-900 dark:text-white">Admin User</span>
            </div>
            <div class="flex flex-col space-y-1 pt-4 border-t border-gray-100 dark:border-gray-800">
               <div class="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                  <span>Created</span>
                  <span>{{ task.created_at | date:'medium' }}</span>
               </div>
               <div class="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                  <span>Updated</span>
                  <span>{{ task.updated_at | date:'medium' }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .ProseMirror {
      padding: 1rem;
      min-height: 120px;
      outline: none;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    :host ::ng-deep .tiptap-editor {
      background: transparent;
    }
    :host ::ng-deep .ProseMirror p.is-editor-empty:first-child::before {
      content: 'Add a description...';
      float: left;
      color: #9ca3af;
      pointer-events: none;
      height: 0;
    }
  `]
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private commentService = inject(CommentService);
  private memberService = inject(MemberService);
  private authService = inject(AuthService);

  editor: Editor;
  commentEditor: Editor;

  newComment = '';
  comments = signal<any[]>([]);
  members = signal<any[]>([]);

  statuses: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];
  priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<TaskDetailComponent>
  ) {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.task.description || '',
    });

    this.commentEditor = new Editor({
      extensions: [StarterKit],
    });
  }

  async ngOnInit() {
    this.loadComments();
    this.loadMembers();
    
    this.commentService.subscribeToComments(this.task.id, () => {
      this.loadComments();
    });
  }

  ngOnDestroy() {
    this.editor.destroy();
    this.commentEditor.destroy();
  }

  async loadComments() {
    const data = await this.commentService.getComments(this.task.id);
    this.comments.set(data);
  }

  async loadMembers() {
    const data = await this.memberService.getProjectMembers(this.task.project_id);
    this.members.set(data);
  }

  async updateTask(updates: Partial<Task>) {
    await this.taskService.updateTask(this.task.id, updates);
  }

  async addComment() {
    if (!this.newComment || this.newComment === '<p></p>') return;
    const user = this.authService.user();
    if (!user) return;

    await this.commentService.createComment(this.task.id, user.id, this.newComment);
    this.newComment = '';
    this.commentEditor.commands.setContent('');
  }

  close() {
    this.dialogRef.close();
  }
}
