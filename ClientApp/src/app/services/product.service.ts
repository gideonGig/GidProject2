import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { flatMap, first, shareReplay } from 'rxjs/operators';
j

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  
  private baseUrl: string = "/api/product/getproducts";
  private productUrl: string = "api/product/addproduct";
  private deleteUrl: string = "api/product/deleteproduct";
  private updateUrl: string = "api/product/updateproduct";

  private product$: Observable<Product[]>;

  getProducts(): Observable<Product[]>
  {
    if (!this.product$) 
    {
      this.product$ = this.http.get<Product[]>(this.baseUrl).pipe(shareReplay());
    }

    return this.product$;
  }

  //get product by ID
  getProductsById(id: number): Observable<Product>
  {
    return this.getProducts().pipe(flatMap(result => result), first(product => product.productId == id));

  //insert product
  insertProduct(newProduct: Product): Observable<product>
  {
  }

  //update Product
  updateProduct(id: number, editProduct: Product): Observable<product>
  {

  }

  deleteProduct(id: number): Observable<any>
  {
  }

  //clear cache
  clearcache()
  {
    this.product$ = null;
  }
}
