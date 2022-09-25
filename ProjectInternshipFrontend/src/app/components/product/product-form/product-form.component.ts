import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params, TitleStrategy } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Unit } from 'src/app/enums/unit.enum';
import { Product } from 'src/app/models/product.model';
import { Stock } from 'src/app/models/stock.model';
import { ProductService } from 'src/app/services/product/product.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  public errors: string[] = [];

  private _subscriptionList: Subscription[] = [];
  selectedProduct?: Product;

  unitOptions = Object.entries(Unit).map(([key, value]) => ({key, value}));
  productForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _stockService: StockService,
    private _snackBar: MatSnackBar
  ) {
    this._createForm();
    
   }

  ngOnInit(): void {
    const url = this._activatedRoute.snapshot.routeConfig
    if(url?.path?.includes('update')){
      this._getPznFromLink();
    }
    
  }

  private _createForm() {
    this.productForm = this._formBuilder.group({
      pzn: [null, [Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+$')]],
      supplier: [null, Validators.maxLength(100)],
      productName: [null, [Validators.required, Validators.maxLength(100)]],
      strength: [null, [Validators.required, Validators.maxLength(100)]],
      packageSize: [null, [Validators.required, Validators.maxLength(20)]],
      unit: [Unit.ST, [Validators.required, Validators.maxLength(2)]]
    });
  }

  private _getPznFromLink(){
    this._subscriptionList.push(
      this._activatedRoute.params.pipe(
        take(1)
      ).subscribe({
       next: (params: Params) => {
        console.log('Get parameter success!');
        this._getProductByPzn(params['pzn']);
      },
       error: () => console.error('Failed to get the parameter! ')
      })
    )
  }

  private _getProductByPzn(pzn: string) {
    this._subscriptionList.push(
    this._productService.getProductByPzn(pzn).pipe(
      take(1)
    ).subscribe({
      next: (product: Product) => {
        console.log('Get product for update success!');
        this.productForm.patchValue(product);
        this.selectedProduct = product;
      },
      error: (error: HttpErrorResponse) => console.error('Could not get the product! ', error.error)
    })
    )
  }

  private _updateProduct(product: Product){
    this._subscriptionList.push(
    this._productService.updateProduct(product).subscribe({
      next: (product: Product) => {
        console.log('Product updated with success: ', product);
        this._router.navigateByUrl('/products');
      },
      error: (error: HttpErrorResponse) => {
        console.error('You cannot update the product because: ', error.error);
        this.errors.push(error.error.concat('\n'));
        this.errors.forEach((error) => {this.openSnackBar(error)});
      }
    })
    )
  }

  private _createProduct(product: Product){
    this._subscriptionList.push(
    this._productService.createProduct(product).subscribe({
      next: (product: Product) => {
        console.log('Product created with success: ', product);
        this.getStockIdForProduct(product.pzn);
      },
      error: (error: HttpErrorResponse) => {
        console.error('You cannot add the new product because: ', error.error);
        this.errors.push(error.error.concat('\n'));
        this.errors.forEach((error) => {this.openSnackBar(error)})
      }
    })
    )
  }

  submitProductForm(){
    this.errors = [];
    const productToPersist: Product = {
      pzn: this.selectedProduct?.pzn ?? this.productForm.controls['pzn'].getRawValue(),
      ...this.productForm.getRawValue()
    };

    !!this.selectedProduct ? this._updateProduct(productToPersist) : this._createProduct(productToPersist)
  }

  resetForm(){
    if(!!this.selectedProduct){
      this.productForm.reset();
      this.productForm.controls['pzn'].setValue(this.selectedProduct.pzn);
    }
    else {
      this.productForm.reset();
    }
  }

  getStockIdForProduct(pzn: string){
    this._subscriptionList.push(
    this._stockService.getStockByProductPzn(pzn).subscribe({
      next: (stock: Stock) => {
        console.log('Get stock success for created product: ', stock);
        this._router.navigate([`/stocks/update/${stock.id}`])
      },
      error: (error: HttpErrorResponse) => {
        console.error('Could not get stock! ', error.error);
      }
    })
    )
  }

  openSnackBar(error: string){
    this._snackBar.open(error, 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10 * 1000
    })
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
