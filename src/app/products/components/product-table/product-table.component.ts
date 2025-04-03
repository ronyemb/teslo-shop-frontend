import { Product } from '@/products/interfaces/product-interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-table',
  imports: [
    RouterLink,
    ProductImagePipe,
    CurrencyPipe
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {

  products = input.required<Product[]>();

}
