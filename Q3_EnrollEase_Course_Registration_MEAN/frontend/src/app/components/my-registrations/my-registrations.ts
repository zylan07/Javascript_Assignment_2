import { Component, inject, input, signal, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RegistrationService } from '../../services/registration.service';
import { CourseService } from '../../services/course.service';
import { Registration, StudentInfo } from '../../models';

@Component({
  selector: 'app-my-registrations',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.css',
})
export class MyRegistrations {
  private regs = inject(RegistrationService);
  private courses = inject(CourseService);

  readonly initialRoll = input<string>('');
  readonly roll = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{2}[A-Za-z]{2,4}\d{3}$/)],
  });
  readonly student = signal<StudentInfo | null>(null);
  readonly list = signal<Registration[]>([]);
  readonly credits = signal(0);
  readonly msg = signal('');

  constructor() {
    // when coming from a successful registration, auto-load that student
    effect(() => {
      const r = this.initialRoll();
      if (r) {
        this.roll.setValue(r);
        this.find();
      }
    });
  }

  find(): void {
    this.msg.set('');
    if (this.roll.invalid) {
      this.roll.markAsTouched();
      return;
    }
    this.regs.forStudent(this.roll.value).subscribe({
      next: (r) => {
        this.student.set(r.student);
        this.list.set(r.registrations);
        this.credits.set(r.totalCredits);
      },
      error: (e) => {
        this.student.set(null);
        this.list.set([]);
        this.msg.set(e.error?.message || 'Not found');
      },
    });
  }

  cancel(reg: Registration): void {
    if (!confirm(`Cancel registration for ${reg.course.code} - ${reg.course.title}?`)) return;
    this.regs.cancel(reg._id).subscribe({
      next: (r) => {
        this.msg.set(r.message);
        this.find();
        this.courses.load();
      },
      error: (e) => this.msg.set(e.error?.message || 'Could not cancel'),
    });
  }
}
