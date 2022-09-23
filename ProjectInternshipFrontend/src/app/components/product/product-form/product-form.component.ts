import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
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

  public isAnyError: boolean = false;
  public errors: String[] = [];

  private _subscriptionList: Subscription[] = [];
  private _selectedProduct?: Product;

  unitOptions = Object.entries(Unit).map(([key, value]) => ({key, value}));
  productForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _stockService: StockService
  ) {
    this._createForm();
   }

  ngOnInit(): void {
    this._getPznFromLink();
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
       next: (params: Params) => this._getProductByPzn(params['pzn']),
       error: (error: HttpErrorResponse) => alert(error.error)
      })
    )
  }

  private _getProductByPzn(pzn: string) {
    this._productService.getProductByPzn(pzn).pipe(
      take(1)
    ).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
        this._selectedProduct = product;
      },
      error: (error: HttpErrorResponse) => alert(error.error)
    });
  }

  private _updateProduct(product: Product){
    this._productService.updateProduct(product).subscribe({
      next: (product: Product) => this._router.navigateByUrl('/products'),
      error: (error: HttpErrorResponse) => console.error('You cannot update the product because: ', error.error)
    })
  }

  private _createProduct(product: Product){
    this._productService.createProduct(product).subscribe({
      next: (product: Product) => {
        this.getStockIdForProduct(product.pzn);
      },
      error: (error: HttpErrorResponse) => {
        console.error('You cannot add the new product because: ', error.error)
        this.errors.push(error.error.concat('\n'));
        this.isAnyError = true;
      }
    })
  }

  submitProductForm(){
    this.errors = [];
    this.isAnyError = false;
    const productToPersist: Product = {
      pzn: this._selectedProduct?.pzn ?? this.productForm.controls['pzn'].getRawValue(),
      ...this.productForm.getRawValue()
    };

    !!this._selectedProduct ? this._updateProduct(productToPersist) : this._createProduct(productToPersist)
  }

  getStockIdForProduct(pzn: string){
    this._stockService.getStockByProductPzn(pzn).subscribe((stock: Stock) => {
      this._router.navigate([`/stocks/update/${stock.id}`])
    })
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
