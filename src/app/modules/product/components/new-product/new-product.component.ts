import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryElement } from 'src/app/modules/category/CategoryElement';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  public productForm!: FormGroup;
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = '';
  categories: CategoryElement[] = [];
  selectedFile: any;
  nameImage: string = "";

  ngOnInit(): void {
    this.estadoFormulario = 'Agregar';
    this.getCategories();
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required],
    });

    if (this.data != null) {
      this.updateForm(this.data);
      this.estadoFormulario = 'Actualizar';
    }
  }

  onSave() {
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImage = new FormData();

    uploadImage.append('picture', data.picture, data.picture.name);
    uploadImage.append('name', data.name);
    uploadImage.append('price', data.price);
    uploadImage.append('quantity', data.quantity);
    uploadImage.append('categoryId', data.category);

    if (this.data != null) {
      this.productService.updateProduct(uploadImage, this.data.id).subscribe({
        next: (data) => {
          this.dialogRef.close(1);
        },
        error: (error) => {
          this.dialogRef.close(2);
        }
      })
    }else{
      this.productService.saveProduct(uploadImage).subscribe({
        next: (data) => {
          this.dialogRef.close(1);
        },
        error: (error) => {
          this.dialogRef.close(2);
        }
      })
    }
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data:any) => {
        this.categories = data.categoryResponse.category;
      },
      error: (error) => {
        console.log("Error al consultar categorías");

      }
    })
  }

  onFileChanged(event: any){
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.nameImage = this.selectedFile.name;
  }

  updateForm(data: any){
    this.productForm = this.fb.group({
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      quantity: [data.quantity, Validators.required],
      category: [data.category.id, Validators.required],
      picture: ['', Validators.required],
    });
  }
}
