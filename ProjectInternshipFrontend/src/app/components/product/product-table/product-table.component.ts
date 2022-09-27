import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock/stock.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, OnDestroy{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  productList: Product[] = [];
  subscriptionList: Subscription[] = [];
  productDeleted!: Product;

  myControl = new FormControl('');

  displayedColumns: string[] = ['pzn', 'supplier', 'productName', 'strength', 'packageSize', 'unit', 'stockPrice','stockQuantity', 'edit', 'delete', 'getStock', 'editStock'];
  dataSource = new MatTableDataSource<Product>(this.productList);
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  constructor(private _productService: ProductService, private _stockService: StockService, private _router: Router) { }

  ngOnInit(): void {
    this.subscriptionList.push(
      this._productService.getAllProducts().subscribe({
        next: (products: Product[]) => {
        console.log('Succes! These are the products: ', products);
        this.productList = products;
        this.dataSource = new MatTableDataSource<Product>(this.productList);
        this.dataSource.paginator = this.paginator;
        products.forEach((product) => {
          if(this.options.includes(product.productName) === false){
            this.options.push(product.productName)
          }
          })
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to get all the products!', error.error);
        }
      })
    );
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub) => sub.unsubscribe());
  }

  createProduct(){
    this._router.navigate([`products/create`]);
  }

  updateProduct(product: Product){
    this._router.navigate([`products/update/${product.pzn}`]);
  }

  deleteProduct(product: Product){
    this.subscriptionList.push(
    this._productService.deleteProduct(product.pzn).subscribe({
      next: () => {
        console.log('Success! The product: ', product, ' was deleted');
        this.productList = this.productList.filter(
          (productInList: Product) => productInList.pzn !== product.pzn
        );
        this.dataSource = new MatTableDataSource<Product>(this.productList);
        this.dataSource.paginator = this.paginator;
        this.options = [];
        this.productList.forEach((product) => {
          if(this.options.includes(product.productName) === false){
            this.options.push(product.productName)
          }
        })
      },
      error: (error: HttpErrorResponse) => {
        console.error('You could not delete the product! ', error.error);
      }
    })
    )
  }

  getStock(pzn: string){
    this.subscriptionList.push(
      this._stockService.getStockByProductPzn(pzn).subscribe({
        next: (stock: Stock) => {
          console.log('Success! The stock for the product is: ', stock);
          const index = this.productList.findIndex((product) => product.pzn === pzn);
          this.productList[index].stock = stock;
          console.log('Product that I just got the stock for ', this.productList[index]);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to get stock for product!', error.error);
        }
      })
    )
  }

  editStock(pzn: string){
    this.subscriptionList.push(
      this._stockService.getStockByProductPzn(pzn).subscribe({
        next: (stock: Stock) => {
          console.log('Success getting the stock id ', stock.id);
          this._router.navigate([`/stocks/update/${stock.id}`]);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to get the stock id! ', error.error);
        }
      })
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  

}
