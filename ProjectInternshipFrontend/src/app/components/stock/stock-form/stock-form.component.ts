import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { Stock } from 'src/app/models/stock.model';
import { ProductService } from 'src/app/services/product/product.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss']
})
export class StockFormComponent implements OnInit, OnDestroy {

  private _subscriptionList: Subscription[] = [];

  stockToPersist!: Stock;

  stockForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _stockService: StockService, private _productService: ProductService, private _activatedRoute: ActivatedRoute, private _router: Router) { 
    this.createForm();
  }


  ngOnInit(): void {

    this._subscriptionList.push(
      this._activatedRoute.params.subscribe((params: Params) => {
      console.log('These are the params: ', params['id'])
      this._stockService.getStockById(params['id']).subscribe((stock: Stock) => {
        console.log('The stock is: ', stock)
        this.stockForm.patchValue(stock)
        this.stockToPersist = stock;
      })
    })
    )
    
  }

  private createForm(){
    this.stockForm = this._formBuilder.group({
      quantity: [null],
      price: [null]
    })
  }

  submitStockForm(){
    this.stockToPersist = {
      ...this.stockToPersist,
      quantity: this.stockForm.controls['quantity'].getRawValue(),
      price: this.stockForm.controls['price'].getRawValue()
    }
    
    console.log(this.stockToPersist)
    this._stockService.updateStock(this.stockToPersist).subscribe((stock: Stock) => {
      console.log('The stock sent is: ', stock)
      this._router.navigateByUrl(`/stocks`)
    })
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription) => subscription.unsubscribe());
  }
}
