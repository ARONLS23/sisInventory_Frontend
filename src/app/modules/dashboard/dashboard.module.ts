import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { CategoryModule } from '../category/category.module';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from '../product/product.module';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    CategoryModule,
    ProductModule,
    MaterialModule
  ],
})
export class DashboardModule {}
