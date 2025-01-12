import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { CategoryElement } from '../../CategoryElement';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private util = inject(UtilService);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  isAdmin: any;

  ngOnInit(): void {
    this.getCategories();
    this.isAdmin = this.util.isAdmin();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.processCategoriesResponse(data);
        console.log('rpta categorias', data);
      },
      error: (error) => {
        console.log('Error', error);
      },
    });
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == '00') {
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Categoría Agregada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al guardar categoría', 'Error');
      }
    });
  }

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: { id: id, name: name, description: description },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Categoría Actualizada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar(
          'Se produjo un error al actualizar categoría',
          'Error'
        );
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id, module: 'category' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Categoría Eliminada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al eliminar categoría', 'Error');
      }
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.getCategories();
    }
    this.categoryService.getCategoryByName(termino).subscribe({
      next: (data) => {
        this.processCategoriesResponse(data);
        console.log('rpta categorias', data);
      },
      error: (error) => {
        console.log('Error', error);
      },
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  exportExcel() {
    this.categoryService.exportCategories().subscribe({
      next: (data) => {
        let file = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement('a');
        anchor.download = 'categories.xlsx';
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar('Archivo exportado correctamente', 'Exitoso');
      },
      error: (error) => {
        console.log('Error', error);
        this.openSnackBar('No se pudo exportar el archivo', 'Error');
      },
    });
  }
}
