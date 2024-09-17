import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductElement } from '../../ProductElement';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      },
    });
  }

  processProductsResponse(resp: any) {
    const dataProduct: ProductElement[] = [];
    if (resp.metadata[0].code == "00") {
      let listProduct = resp.productResponse.products;

      listProduct.forEach((element: ProductElement) => {
        element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dataProduct.push(element);
      });

      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;
    }
  }
}
