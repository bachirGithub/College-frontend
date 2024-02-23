import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { StudentAddEditComponent } from './student-add-edit/student-add-edit.component';
import { StudentService } from './services/student.service';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'age', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private _dialog: MatDialog,
    private _studentService: StudentService,
    private _coreService: CoreService
  ) {}
  ngOnInit(): void {
    this.getStudentsList();
  }

  openAddStudentForm() {
    const dialogRef = this._dialog.open(StudentAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        this.getStudentsList();
      },
    });
  }

  getStudentsList() {
    this._studentService.getStudents().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteStudent(id: number) {
    this._studentService.deleteOneStudent(id).subscribe({
      next: (res: any) => {
        this._coreService.openSnackBar("L'étudiant a bien été supprimé", 'OK');
        this.getStudentsList();
      },
      error: console.log,
    });
  }

  openEditStudentForm(data: any) {
    this._dialog.open(StudentAddEditComponent, { data });
  }
}
