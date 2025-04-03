import { ProductTableComponent } from '@/products/components/product-table/product-table.component';
import { ProductsService } from '@/products/services/products.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [
    ProductTableComponent,
    PaginationComponent,
    RouterLink
  ],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.css'
})
export class ProductsAdminPageComponent {

  paginationService = inject(PaginationService);
  productService = inject(ProductsService);
  router = inject(Router);

  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage(),
      limit: this.productsPerPage()
    }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        offset: (request.page - 1) * 9,
        limit: request.limit
      })
    }
  });

  updatePage(page: number) {
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
  }

}
