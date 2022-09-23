import { Component, OnInit, OnDestroy } from '@angular/core';
import { Stock } from 'src/app/models/stock.model';
import { Subscription } from 'rxjs';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent implements OnInit, OnDestroy {
  
  private _subscriptionList: Subscription[] = [];

  stockList: Stock[] = [];
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource<Stock>(this.stockList);
  displayedColumns: string[] = ['id', 'quantity', 'price', 'product', 'update']

  constructor(private _stockService: StockService, private _router: Router) { }

  ngOnInit(): void {
    this._subscriptionList.push(
      this._stockService.getAllStocks().subscribe((stocks: Stock[]) => {
        this.stockList = stocks
        this.dataSource = new MatTableDataSource<Stock>(this.stockList)
      })
    )
  }

  updateStock(stock: Stock) {
      console.log('This is the stock to be updated: ', stock)
      this._router.navigate([`/stocks/update/${stock.id}`])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
