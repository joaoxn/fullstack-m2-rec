import { Component, input, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { UserService } from '../../shared/services/user.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { StudentInterface } from '../../shared/interfaces/student.interface';
import { StudentService } from '../../shared/services/student.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterLink, FormsModule, MatIconModule, MatInputModule, MatButtonModule, MatTableModule, MatProgressBarModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  students?: StudentInterface[];
  studentsTableData?: MatTableDataSource<StudentInterface>;
  @ViewChild('table') studentsTable!: MatTable<StudentInterface>;

  searchValue!: string;

  isLoading = false;

  displayedColumns = ["position", "value", "actions"];

  constructor(private studentService: StudentService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getStudents(false);
  }

  getStudents(render = true) {
    this.isLoading = true;
    console.log('Current User:', this.userService.currentUser);
    
    this.studentService.getAll().subscribe({
      next: students => {
        console.log('students:', students);
        
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
      console.log('Current student of search:', student);

      return student.name.toLowerCase().includes(name.toLowerCase())
    });

    console.log(searchStudents);

    this.update(searchStudents);
  }

  update(students: StudentInterface[]) {
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
