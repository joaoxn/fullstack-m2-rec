import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/services/user.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Student } from '../../shared/interfaces/student';
import { StudentService } from '../../shared/services/student.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterLink, FormsModule, MatIconModule, MatInputModule, MatButtonModule, MatTableModule, MatProgressBarModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  students?: Student[];
  studentsTableData?: MatTableDataSource<Student>;
  @ViewChild('table') studentsTable!: MatTable<Student>;

  searchValue!: string;

  isLoading = false;

  displayedColumns = ["position", "value", "actions"];

  constructor(private studentService: StudentService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getStudents(false);
  }

  getStudents(render = true) {
    this.isLoading = true;
    
    this.studentService.getAll().subscribe({
      next: students => {
        this.students = students;
        this.studentsTableData = new MatTableDataSource(this.students);
        this.isLoading = false;
        if (render) this.search(this.searchValue);
      },
      complete: () => {
        this.students = this.students || [];
        this.studentsTableData = new MatTableDataSource(this.students);
        this.isLoading = false;
        if (render) this.search(this.searchValue);
      },
      error: error => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  search(name: string) {
    if (!this.students) return;

    const searchStudents = this.students.filter(student => {
      return student.name.toLowerCase().includes(name.toLowerCase())
    });

    this.update(searchStudents);
  }

  update(students: Student[]) {
    if (!this.studentsTableData) return;

    this.studentsTableData.data = students;
    this.studentsTable.renderRows();
  }

  remove(id: string) {
    this.isLoading = true;
    this.studentService.delete(id).subscribe(() => {
      this.getStudents();
    });
  }
}
