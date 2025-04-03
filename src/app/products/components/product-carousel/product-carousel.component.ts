import { Product } from '@/products/interfaces/product-interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { first } from 'rxjs';

@Component({
  selector: 'product-carousel',
  imports: [
    ProductImagePipe
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges{

  images = input.required<string[]>();
  swipeDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined;
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['images'].firstChange){
      return;
    };

    if(!this.swiper) return;

    this.swiper.destroy(true, true);
    const paginationElement: HTMLDivElement = this.swipeDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationElement.innerHTML = '';
    setTimeout(() => {
      this.swipperInit();
    }, 100)
    this.swipperInit();

  }

  ngAfterViewInit(): void {
    this.swipperInit();
  }

  swipperInit() {
    const element = this.swipeDiv().nativeElement;
    if(!element) return;

    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules:[
        Navigation, Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

}
