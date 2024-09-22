import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {

  private dialogRef = inject(MatDialogRef);
  private categoriaService = inject(CategoryService);
  private productService = inject(ProductService);
  public data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close(3);
  }

  delete(){
    if (this.data != null) {

      if (this.data.module == "category") {
        this.categoriaService.deleteCategory(this.data.id).subscribe({
          next: (data) => {
            this.dialogRef.close(1);
          },
          error: (error) => {
            this.dialogRef.close(2);
          }
        })
      }
      else if (this.data.module == "product"){
        this.productService.deleteProduct(this.data.id).subscribe({
          next: (data) => {
            this.dialogRef.close(1);
          },
          error: (error) => {
            this.dialogRef.close(2);
          }
        })
      }


    }else{
      this.dialogRef.close(2);
    }
  }
}
