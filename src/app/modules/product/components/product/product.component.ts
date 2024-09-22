import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductElement } from '../../ProductElement';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'quantity',
    'category',
    'picture',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProductElement>();

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.processProductsResponse(data);
        console.log('rpta products', data);
      },
      error: (error) => {
        console.log('Error', error);
      }
    });
  }

  processProductsResponse(resp: any) {
    const dataProduct: ProductElement[] = [];
    if (resp.metadata[0].code == "00") {
      let listProduct = resp.productResponse.products;

      listProduct.forEach((element: ProductElement) => {
        //element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dataProduct.push(element);
      });

      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog(){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Producto Agregado', 'Exitoso');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al guardar producto', 'Error');
      }
    });
  }

  edit(id: number, name: string, price: number, quantity: number, category: any){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: {id: id, name: name, price: price, quantity: quantity, category: category}
    });
    console.log(dialogRef.componentInstance.data);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('Producto Actualizado', 'Exitoso');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al actualizar producto', 'Error');
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id, module: "product" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar('PRoducto Eliminado', 'Exitoso');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al eliminar producto', 'Error');
      }
    });
  }

  buscar(nombre: string){
    if (nombre.length === 0) {
      return this.getProducts();
    }
    this.productService.getProductByName(nombre).subscribe({
      next: (data) => {
        this.processProductsResponse(data);
        console.log('rpta products', data);
      },
      error: (error) => {
        console.log('Error', error);
      }
    })
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
