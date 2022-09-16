import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Unit } from 'src/app/enums/unit.enum';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private _subscriptionList: Subscription[] = [];
  private _selectedProduct?: Product;

  unitOptions = Object.entries(Unit).map(([key, value]) => ({key, value}));
  productForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
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
      unit: [null, [Validators.required, Validators.maxLength(2)]]
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
      next: (product: Product) => this._router.navigateByUrl('/products'),
      error: (error: HttpErrorResponse) => console.error('You cannot add the new product because: ', error.error)
    })
  }

  submitProductForm(){
    const productToPersist: Product = {
      pzn: this._selectedProduct?.pzn ?? this.productForm.controls['pzn'].getRawValue(),
      ...this.productForm.getRawValue()
    };

    !!this._selectedProduct ? this._updateProduct(productToPersist) : this._createProduct(productToPersist)
  }

  getErrorMessagePzn(){
    if(this.productForm.controls['pzn'].hasError('required')){
      return 'This field is required!';
    }
    if(this.productForm.controls['pzn'].hasError('maxlength')){
      return 'This field must less than or equal to 8 characters long!';
    }
    if(this.productForm.controls['pzn'].hasError('pattern')){
      return 'This field must contain only numbers';
    }
    return 'Invalid field';
  }

  getErrorMessageSupplier(){
    if(this.productForm.controls['supplier'].hasError('maxlength')){
      return 'This field must less than 100 characters long!';
    }
    return 'Invalid field';
  }

  getErrorMessageProductName(){
    if(this.productForm.controls['productName'].hasError('required')){
      return 'This field is required!';
    }
    if(this.productForm.controls['productName'].hasError('maxlength')){
      return 'This field must less than 100 characters long!';
    }
    return 'Invalid field';
  }

  getErrorMessageStrength(){
    if(this.productForm.controls['strength'].hasError('required')){
      return 'This field is required!';
    }
    if(this.productForm.controls['strength'].hasError('maxlength')){
      return 'This field must less than 100 characters long!'; 
    }
    return 'Invalid field';
  }

  getErrorMessagePackageSize(){
    if(this.productForm.controls['packageSize'].hasError('required')){
      return 'This field is required!';
    }
    if(this.productForm.controls['packageSize'].hasError('maxlength')){
      return 'This field must less than 20 characters long!'; 
    }
    return 'Invalid field';
  }

  getErrorMessageUnit(){
    if(this.productForm.controls['unit'].hasError('required')){
      return 'This field is required!';
    }
    if(this.productForm.controls['unit'].hasError('maxlength')){
      return 'This field must less than 2 characters long!'; 
    }
    return 'Invalid field';
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
