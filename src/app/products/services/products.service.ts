import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product-interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '@/auth/interfaces/auth.interface';

const baseUrl = environment.baseURL;
interface Options{
  limit?: number;
  offset?: number,
  gender?: string,
}

const emptyProdcuct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, { params: { limit, offset, gender } })
      .pipe(
        tap(resp => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
    .pipe(
      tap(resp => console.log(resp)),
      tap(product => this.productCache.set(idSlug, product))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProdcuct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap(resp => console.log(resp)),
      tap(product => this.productCache.set(id, product))
    );
  }


  updateProduct(id:string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList)
    .pipe(
      map( imageNames => ({
        ...productLike,
        images: [... currentImages, ...imageNames]}),
      ),
      switchMap(upadtedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`, upadtedProduct)),
      tap(product => this.updateProductCache(product))
    )


    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    // .pipe(
    //   tap(product => this.updateProductCache(product))
    // )
  }
  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
    .pipe(
      tap(product => this.updateProductCache(product))
    )
  }
  updateProductCache(product: Product) {
    this.productCache.set(product.id, product);

    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(currentProduct => {
        return currentProduct.id === product.id ? product : currentProduct
      });
    })
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables).pipe(
      tap(resp => console.log(resp))
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<{fileName: string}>(`${baseUrl}/files/product`, formData)
    .pipe(
      map(resp => resp.fileName)
    )
  }

}
