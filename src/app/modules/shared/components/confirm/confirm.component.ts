import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {

  private dialogRef = inject(MatDialogRef);
  private categoriaService = inject(CategoryService);
  public data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close(3);
  }

  delete(){
    if (this.data != null) {
      this.categoriaService.deleteCategory(this.data.id).subscribe( data =>{
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      })
    }else{
      this.dialogRef.close(2);
    }
  }
}
