import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-student-add-edit',
  templateUrl: './student-add-edit.component.html',
  styleUrls: ['./student-add-edit.component.scss'],
})
export class StudentAddEditComponent implements OnInit {
  studentFom: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _studentService: StudentService,
    private _dialogRef: MatDialogRef<StudentAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.studentFom = this._fb.group({
      name: '',
      email: '',
      age: '',
    });
  }
  ngOnInit(): void {
    this.studentFom.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.studentFom.valid) {
      if (this.data) {
        this._studentService
          .updateStudent(this.data.id, this.studentFom.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar(
                "L'étudiant a bien été modifié",
                'OK'
              );
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.log(err);
            },
          });
      } else {
        this._studentService.addStudent(this.studentFom.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar(
              "L'étudiant a bien été ajouté",
              'OK'
            );
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    }
  }
}
