import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/models/stock.model';

@Injectable()
export class StockService {

  private readonly _baseurl = 'http://localhost:8081';

  constructor(private _httpClient: HttpClient) { }

  getAllStocks(): Observable<Stock[]> {
    return this._httpClient.get(`${this._baseurl}/stocks`) as Observable<Stock[]>;
  }

  getStockById(id: number): Observable<Stock> {
    return this._httpClient.get(`${this._baseurl}/stocks/${id}`) as Observable<Stock>;
  }

  getStockByProductPzn(pzn: string): Observable<Stock> {
    return this._httpClient.get(`${this._baseurl}/products/${pzn}/stock`) as Observable<Stock>;
  }

  updateStock(stock: Stock): Observable<Stock> {
    return this._httpClient.put(`${this._baseurl}/stocks/update`, stock) as Observable<Stock>;
  }
}
