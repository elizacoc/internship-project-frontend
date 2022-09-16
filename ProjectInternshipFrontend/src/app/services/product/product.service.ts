import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product.model';

@Injectable()
export class ProductService {

  private readonly _baseurl = 'http://localhost:8081';

  productPzn$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private _httpClient: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this._httpClient.get(`${this._baseurl}/products`) as Observable<Product[]>;
  }

  updateProduct(product: Product): Observable<Product> {
    return this._httpClient.put(`${this._baseurl}/products/update/${product.pzn}`, product) as Observable<Product>;
  }

  deleteProduct(pzn: string): Observable<Product> {
    return this._httpClient.delete(`${this._baseurl}/products/delete/${pzn}`) as Observable<Product>;
  }

  getProductByPzn(pzn: string): Observable<Product> {
    return this._httpClient.get(`${this._baseurl}/products/${pzn}`) as Observable<Product>;
  }

  createProduct(product: Product): Observable<Product> {
    return this._httpClient.post(`${this._baseurl}/products/create`, product) as Observable<Product>;
  }
}
