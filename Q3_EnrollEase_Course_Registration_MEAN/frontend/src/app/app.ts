import { Component, OnInit, inject, signal } from '@angular/core';
import { CourseService } from './services/course.service';
import { CourseList } from './components/course-list/course-list';
import { RegisterForm } from './components/register-form/register-form';
import { MyRegistrations } from './components/my-registrations/my-registrations';
import { AddCourse } from './components/add-course/add-course';

type Tab = 'register' | 'mine' | 'admin';

@Component({
  selector: 'app-root',
  imports: [CourseList, RegisterForm, MyRegistrations, AddCourse],
  template: `
    <header class="hero">
      <div>
        <h1>Enroll<span>Ease</span></h1>
        <p>Course Registration Portal · Odd Semester 2026–27 · MEAN Stack</p>
      </div>
      <nav>
        <button [class.on]="tab() === 'register'" (click)="tab.set('register')">Browse & Register</button>
        <button [class.on]="tab() === 'mine'" (click)="tab.set('mine')">My Registrations</button>
        <button [class.on]="tab() === 'admin'" (click)="tab.set('admin')">Manage Courses</button>
      </nav>
    </header>

    <main>
      @switch (tab()) {
        @case ('register') {
          <div class="split">
            <app-course-list />
            <app-register-form (registered)="lastRoll.set($event)" />
          </div>
        }
        @case ('mine') { <app-my-registrations [initialRoll]="lastRoll()" /> }
        @case ('admin') { <app-add-course /> }
      }
    </main>
    <footer>U21CSP12 JavaScript Frameworks · Assignment II · Sathya R V (24CS192)</footer>
  `,
  styles: `
    .hero { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;
      padding: 28px 40px; background: radial-gradient(circle at 10% 20%, #6366f1, #3730a3); color: #fff; }
    h1 { margin: 0; font-size: 32px; } h1 span { color: #fda4af; }
    .hero p { margin: 6px 0 0; opacity: .85; }
    nav { display: flex; gap: 6px; background: rgba(255,255,255,.12); padding: 5px; border-radius: 12px; }
    nav button { border: 0; background: transparent; color: #fff; padding: 9px 16px; border-radius: 9px; cursor: pointer; font-weight: 600; }
    nav button.on { background: #fff; color: var(--indigo); }
    main { max-width: 1260px; margin: 0 auto; padding: 24px; }
    .split { display: grid; grid-template-columns: 1fr 360px; gap: 22px; align-items: start; }
    footer { text-align: center; color: var(--muted); font-size: 12px; padding: 20px; }
    @media (max-width: 900px) { .split { grid-template-columns: 1fr; } }
  `,
})
export class App implements OnInit {
  private courses = inject(CourseService);
  readonly tab = signal<Tab>('register');
  readonly lastRoll = signal('');

  ngOnInit(): void {
    this.courses.load();
  }
}
