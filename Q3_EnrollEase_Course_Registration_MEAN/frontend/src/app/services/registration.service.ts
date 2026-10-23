import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration, RegisterResult, StudentInfo } from '../models';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private http = inject(HttpClient);
  private api = '/api/registrations';

  register(student: StudentInfo, courseIds: string[]): Observable<RegisterResult> {
    return this.http.post<RegisterResult>(this.api, { student, courseIds });
  }

  forStudent(rollNo: string): Observable<{ student: StudentInfo; registrations: Registration[]; totalCredits: number }> {
    return this.http.get<{ student: StudentInfo; registrations: Registration[]; totalCredits: number }>(
      `${this.api}/student/${encodeURIComponent(rollNo.trim())}`
    );
  }

  cancel(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/${id}/cancel`, {});
  }
}
