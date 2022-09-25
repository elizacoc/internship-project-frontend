import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stock } from 'src/app/models/stock.model';
import { ProductService } from 'src/app/services/product/product.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss']
})
export class StockFormComponent implements OnInit, OnDestroy {

  errors: string[] = [];

  private _subscriptionList: Subscription[] = [];

  stockToPersist!: Stock;

  stockForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _stockService: StockService, private _activatedRoute: ActivatedRoute, private _router: Router, private _snackBar: MatSnackBar) { 
    this.createForm();
  }


  ngOnInit(): void {

    this._subscriptionList.push(
      this._activatedRoute.params.subscribe({
        next: (params: Params) => {
          console.log('These are the params: ', params['id']);
          this._subscriptionList.push(
          this._stockService.getStockById(params['id']).subscribe({
            next: (stock: Stock) => {
              console.log('Success! The stock is: ', stock)
              this.stockForm.patchValue(stock)
              this.stockToPersist = stock;
            },
            error: (error: HttpErrorResponse) => {
              console.error('Failed to get stock! ', error.error)
            }
          })
          )
        },
        error: () => {
          console.error('Failed to get parameter!');
        }
      })
    )
    
  }

  private createForm(){
    this.stockForm = this._formBuilder.group({
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]]
    })
  }

  submitStockForm(){ 
    this.errors = [];
    this.stockToPersist = {
      ...this.stockToPersist,
      quantity: this.stockForm.controls['quantity'].getRawValue(),
      price: this.stockForm.controls['price'].getRawValue()
    }
    
    this._subscriptionList.push(
    this._stockService.updateStock(this.stockToPersist).subscribe({
      next: (stock: Stock) => {
        console.log('Success! The updated stock is: ', stock)
        this._router.navigateByUrl(`/products`)
      },
      error: (error: HttpErrorResponse) => {
        console.error('You cannot update the stock because: ', error.error)
        this.errors.push(error.error.concat('\n'));
        this.errors.forEach((error) => {this.openSnackBar(error)})
      }
    })
    )
  }

  resetForm(){
    this.stockForm.reset();
  }

  openSnackBar(error: string){
    this._snackBar.open(error, 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10 * 1000
    })
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription) => subscription.unsubscribe());
  }
}
