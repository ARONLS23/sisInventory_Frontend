import { Component, inject, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductElement } from 'src/app/modules/product/ProductElement';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  charBar: any;
  chardoughnut: any;

  private productService = inject(ProductService);

  ngOnInit() {
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
    const nameProduct: string [] = [];
    const account: number [] = [];

    if (resp.metadata[0].code == "00") {
      let listProduct = resp.productResponse.products;

      listProduct.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        account.push(element.quantity);
      });

      //Gráfico de barras
      this.charBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [
            {label: 'Productos', data: account}
          ]
        }
      });

      //Gráfico de doughnut
      this.chardoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: nameProduct,
          datasets: [
            {label: 'Productos', data: account}
          ]
        }
      });
    }
  }

}
