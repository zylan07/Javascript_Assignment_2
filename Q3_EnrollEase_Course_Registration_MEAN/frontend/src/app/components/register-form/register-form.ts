import { Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { RegistrationService } from '../../services/registration.service';
import { RegisterResult } from '../../models';

/** custom validator: KPRIET style roll number e.g. 24CS192 */
function rollNoValidator(control: AbstractControl): ValidationErrors | null {
  return /^\d{2}[A-Za-z]{2,4}\d{3}$/.test(control.value || '') ? null : { rollNo: true };
}

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private fb = inject(FormBuilder);
  private regs = inject(RegistrationService);
  readonly courses = inject(CourseService);

  readonly registered = output<string>(); // emits the roll number after success
  readonly departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS', 'CSBS'];
  readonly submitting = signal(false);
  readonly result = signal<RegisterResult | null>(null);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    rollNo: ['', [Validators.required, rollNoValidator]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z .]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['CSE', Validators.required],
    year: [3, [Validators.required, Validators.min(1), Validators.max(4)]],
    agree: [false, Validators.requiredTrue],
  });

  /** true when a field was touched and is invalid -> show the error text */
  bad(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    this.error.set('');
    this.result.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.courses.selectedIds().length) {
      this.error.set('Select at least one course from the list.');
      return;
    }
    const { agree, ...student } = this.form.getRawValue();
    student.rollNo = student.rollNo.toUpperCase();
    this.submitting.set(true);
    this.regs.register({ ...student, year: Number(student.year) }, this.courses.selectedIds()).subscribe({
      next: (res) => {
        this.result.set(res);
        this.courses.clearSelection();
        this.courses.load();
        this.submitting.set(false);
        this.registered.emit(student.rollNo);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed');
        if (err.error?.results) this.result.set(err.error);
        this.submitting.set(false);
      },
    });
  }
}
