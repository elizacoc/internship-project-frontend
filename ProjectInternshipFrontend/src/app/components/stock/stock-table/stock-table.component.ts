import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Stock } from 'src/app/models/stock.model';
import { Subscription } from 'rxjs';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent implements OnInit, OnDestroy {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  stockList: Stock[] = [];
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource<Stock>(this.stockList);
  displayedColumns: string[] = ['id', 'quantity', 'price', 'product', 'update'];

  private _subscriptionList: Subscription[] = [];

  constructor(private _stockService: StockService, private _router: Router) { }

  ngOnInit(): void {
    this._subscriptionList.push(
      this._stockService.getAllStocks().subscribe({ 
        next: (stocks: Stock[]) => {
          console.log('Success! These are the stocks: ', stocks);
          this.stockList = stocks;
          this.dataSource = new MatTableDataSource<Stock>(this.stockList);
          this.dataSource.paginator = this.paginator;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to get all stocks! ', error.error);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  updateStock(stock: Stock) {
      console.log('This is the stock to be updated: ', stock);
      this._router.navigate([`/stocks/update/${stock.id}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
