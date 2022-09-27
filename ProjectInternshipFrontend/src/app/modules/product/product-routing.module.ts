import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTableComponent } from 'src/app/components/product/product-table/product-table.component';
import { ProductFormComponent } from 'src/app/components/product/product-form/product-form.component';

const productRoutes: Routes = [
  {path: '', component: ProductTableComponent},
  {path: 'create', component: ProductFormComponent},
  {path: 'update/:pzn', component: ProductFormComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(productRoutes)
  ]
})
export class ProductRoutingModule { }
