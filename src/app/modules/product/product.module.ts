import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { ProductComponent } from './components/product/product.component';
import { NewProductComponent } from './components/new-product/new-product.component';



@NgModule({
  declarations: [
    ProductComponent,
    NewProductComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
