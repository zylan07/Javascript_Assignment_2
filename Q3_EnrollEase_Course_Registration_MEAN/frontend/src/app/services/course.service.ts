import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Course } from '../models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private api = '/api/courses';

  /** all courses from MongoDB */
  readonly courses = signal<Course[]>([]);
  /** ids of courses the student has ticked */
  readonly selectedIds = signal<string[]>([]);

  readonly selectedCourses = computed(() => this.courses().filter((c) => this.selectedIds().includes(c._id)));
  readonly selectedCredits = computed(() => this.selectedCourses().reduce((sum, c) => sum + c.credits, 0));

  load(): void {
    this.http.get<Course[]>(this.api).subscribe((list) => {
      this.courses.set(list);
      // drop selections of courses that became full
      this.selectedIds.update((ids) => ids.filter((id) => list.some((c) => c._id === id && c.seatsLeft > 0)));
    });
  }

  toggle(course: Course): void {
    this.selectedIds.update((ids) =>
      ids.includes(course._id) ? ids.filter((id) => id !== course._id) : [...ids, course._id]
    );
  }

  clearSelection(): void {
    this.selectedIds.set([]);
  }

  add(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.api, course).pipe(tap(() => this.load()));
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`).pipe(tap(() => this.load()));
  }
}
