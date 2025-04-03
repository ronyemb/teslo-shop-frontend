import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { Product } from '@/products/interfaces/product-interface';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { ProductsService } from '@/products/services/products.service';
import { FormErrorLabelComponent } from '@/shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [
    ReactiveFormsModule,
    FormErrorLabelComponent,
    ProductCarouselComponent,

  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();
  router = inject(Router);
  fb = inject(FormBuilder);
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  productsService = inject(ProductsService);
  wasSaved = signal(false);
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  imageToCarousel = computed(()=>{
    const currentProductImages = this.product().images;
    const tempImages = this.tempImages();
    return [...currentProductImages, ...tempImages];
  })

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[''], [Validators.required]],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/(men|women|kid|unisex)/)],
    ],
  });

  ngOnInit(): void {
    this.setFormValue(this.product());

    // Verificar si se pasó el parámetro "saved" en la URL
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('saved') === 'true') {
      this.wasSaved.set(true);
      setTimeout(() => this.wasSaved.set(false), 3000);
    }
  }

  setFormValue(formLike: Partial<Product>) {
    // this.productForm.patchValue(formLike as any);
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      // Crear producto
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      // this.router.navigate(['/admin/products', product.id]);
      this.router.navigate(['/admin/products', product.id], {
        queryParams: { saved: 'true' },
      });
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onFilesSelected(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map((file) => {
      return URL.createObjectURL(file);
    });

    this.tempImages.set(imageUrls);
  }
}
