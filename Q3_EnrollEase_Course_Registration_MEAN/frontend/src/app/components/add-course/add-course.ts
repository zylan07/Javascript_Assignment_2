import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-course',
  imports: [ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse {
  private fb = inject(FormBuilder);
  readonly svc = inject(CourseService);
  readonly msg = signal<{ text: string; ok: boolean } | null>(null);

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,10}$/)]],
    title: ['', [Validators.required, Validators.minLength(4)]],
    instructor: ['', Validators.required],
    credits: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    category: ['Core', Validators.required],
    schedule: [''],
    capacity: [40, [Validators.required, Validators.min(1), Validators.max(200)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.svc.add({ ...v, code: v.code.toUpperCase(), credits: +v.credits, capacity: +v.capacity } as never).subscribe({
      next: (c) => {
        this.msg.set({ text: `${c.code} added to the course list`, ok: true });
        this.form.reset();
      },
      error: (e) => this.msg.set({ text: e.error?.message || 'Could not add course', ok: false }),
    });
  }

  remove(id: string, code: string): void {
    if (!confirm(`Delete ${code}?`)) return;
    this.svc.remove(id).subscribe({
      next: (r) => this.msg.set({ text: r.message, ok: true }),
      error: (e) => this.msg.set({ text: e.error?.message, ok: false }),
    });
  }
}
