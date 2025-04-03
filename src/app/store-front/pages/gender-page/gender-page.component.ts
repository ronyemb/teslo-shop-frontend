import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCardComponent,
    PaginationComponent
  ],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css'
})
export class GenderPageComponent {

  private products = inject(ProductsService);
  private route = inject(ActivatedRoute);
  public paginationService = inject(PaginationService);

  gender = toSignal<string>(this.route.params.pipe(map( ({gender}) => gender)))

  public productsResource = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage(),
    }),
    loader: ({ request }) => {
      return this.products.getProducts({
        gender: request.gender,
        offset: (request.page - 1) * 9
      })
    }
  })








}
