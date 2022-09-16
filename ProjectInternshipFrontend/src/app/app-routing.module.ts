import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'products', loadChildren: () => import('./modules/product/product.module').then((p) => p.ProductModule)},
  {path:'stocks', loadChildren: () => import('./modules/stock/stock.module').then((s) => s.StockModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
