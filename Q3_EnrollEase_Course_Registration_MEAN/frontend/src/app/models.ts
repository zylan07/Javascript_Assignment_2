export interface Course {
  _id: string;
  code: string;
  title: string;
  instructor: string;
  credits: number;
  category: 'Core' | 'Professional Elective' | 'Open Elective' | 'Lab';
  schedule: string;
  capacity: number;
  enrolled: number;
  seatsLeft: number;
}

export interface StudentInfo {
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: number;
}

export interface Registration {
  _id: string;
  course: Course;
  status: 'Registered' | 'Cancelled';
  createdAt: string;
  cancelledAt?: string;
}

export interface RegisterResult {
  message: string;
  totalCredits: number;
  results: { code?: string; ok: boolean; reason?: string }[];
}
