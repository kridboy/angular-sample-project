import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage:number,
                         thePageSize:number,
                         theCategoryId:number):Observable<GetResponseProducts>{
    const url=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProduct(productId: number): Observable<Product> {
    const producturl = `${this.baseUrl}/${productId}`
    return this.httpClient.get<Product>(producturl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map(resp => resp._embedded.productCategory));
  }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(resp => resp._embedded.products));
  }

  searchProducts(keyword: string) {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?keyword=${keyword}`;

    return this.getProducts(searchUrl)
  }

  searchProductsPaginate(thePage:number,
                         thePageSize:number,
                         theKeyword: string):Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?keyword=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
}

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page:{
    size:number,
    totalElements: number,
    totalPages: number,
    number:number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
