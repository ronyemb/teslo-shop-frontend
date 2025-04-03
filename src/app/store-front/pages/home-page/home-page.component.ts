import { Component, inject} from '@angular/core';
import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';


@Component({
  selector: 'app-home-page',
  imports: [
    ProductCardComponent,
    PaginationComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  private products = inject(ProductsService);
  public paginationService = inject(PaginationService);

  public productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage()
    }),
    loader: ({ request }) => {
      return this.products.getProducts({
        offset: (request.page - 1) * 9
      })
    }
  })

}
