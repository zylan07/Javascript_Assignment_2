import { Component, computed, inject, signal } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList {
  readonly svc = inject(CourseService);
  readonly categories = ['All', 'Core', 'Professional Elective', 'Open Elective', 'Lab'];
  readonly category = signal('All');
  readonly search = signal('');

  readonly visible = computed(() => {
    const q = this.search().toLowerCase();
    return this.svc
      .courses()
      .filter((c) => this.category() === 'All' || c.category === this.category())
      .filter((c) => !q || `${c.code} ${c.title} ${c.instructor}`.toLowerCase().includes(q));
  });

  isSelected(c: Course): boolean {
    return this.svc.selectedIds().includes(c._id);
  }

  fill(c: Course): number {
    return Math.round((c.enrolled / c.capacity) * 100);
  }
}
