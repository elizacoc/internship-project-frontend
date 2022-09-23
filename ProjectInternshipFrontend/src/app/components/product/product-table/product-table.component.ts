import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock/stock.service';

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

  toggleButton: boolean = false;

  displayedColumns: string[] = ['pzn', 'supplier', 'productName', 'strength', 'packageSize', 'unit', 'stockPrice','stockQuantity', 'edit', 'delete', 'getStock', 'editStock'];
  dataSource = new MatTableDataSource<Product>(this.productList);

  constructor(private _productService: ProductService, private _stockService: StockService, private _router: Router) { }

  ngOnInit(): void {
    this.subscriptionList.push(
      this._productService.getAllProducts().subscribe((products: Product[]) => {
        console.log('These are the products:', products);
        this.productList = products;
        this.dataSource = new MatTableDataSource<Product>(this.productList);
        this.dataSource.paginator = this.paginator;
      })

      
     
    );
  }

  createProduct(){
    this._router.navigate([`products/create`]);
  }

  updateProduct(product: Product){
    this._router.navigate([`products/update/${product.pzn}`]);
  }

  deleteProduct(product: Product){
    this._productService.deleteProduct(product.pzn).subscribe(() => {
      console.log('The product: ', product, ' was deleted');
      this.productList = this.productList.filter(
        (productInList: Product) => productInList.pzn !== product.pzn
      )
      this.dataSource = new MatTableDataSource<Product>(this.productList);
      this.dataSource.paginator = this.paginator;
    })
  }

  getStock(pzn: string){
    this.subscriptionList.push(
      this._stockService.getStockByProductPzn(pzn).subscribe((stock: Stock) => {
      console.log('The stock for the product is: ', stock);
      const index = this.productList.findIndex((product) => product.pzn === pzn);
      this.productList[index].stock = stock;
      console.log('Product that I just got the stock ', this.productList[index])
      this.toggleButton = !this.toggleButton
    })
    )
    this.toggleButton = !this.toggleButton
  }

  editStock(pzn: string){
    this.subscriptionList.push(
      this._stockService.getStockByProductPzn(pzn).subscribe((stock: Stock) => {
        this._router.navigate([`/stocks/update/${stock.id}`])
      })
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub) => sub.unsubscribe());
  }

}
