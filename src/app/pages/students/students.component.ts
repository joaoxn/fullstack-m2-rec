import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  students?: StudentInterface[];
  studentsTableData?: MatTableDataSource<StudentInterface>;
  @ViewChild('table') studentsTable!: MatTable<StudentInterface>;

  displayedColumns = ["position", "value", "actions"];

  constructor(private studentService: StudentService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.studentService.getAll().subscribe(students => {
      this.students = students;
      this.studentsTableData = new MatTableDataSource(this.students);
    });
  }

  search(name: string) {
    if (!this.students) return;

    const searchStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(name.toLowerCase()));

    console.log(searchStudents);
      
    this.update(searchStudents);
  }

  update(students: StudentInterface[]) {
    if (!this.studentsTableData) return;

    this.studentsTableData.data = students;
    this.studentsTable.renderRows();
  }

  treinos(student: StudentInterface) {
    this.router.navigate(['students', student.id, 'trainings']);
  }

  ver(student: StudentInterface) {
    this.router.navigate(['students', student.id]);
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }
}
