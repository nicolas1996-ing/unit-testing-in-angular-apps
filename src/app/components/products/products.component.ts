import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/main/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllSimple().subscribe({
      next: (products) => {
        console.log(products);
        this.products = products;
      },
      error: (err) => console.log(err),
    });
  }
}
