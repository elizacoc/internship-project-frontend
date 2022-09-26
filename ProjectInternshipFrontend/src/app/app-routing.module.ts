import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './authentication/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'', component: LayoutComponent, children: [
    {path:'login', component: LoginComponent},
  ]},
  {path:'products', loadChildren: () => import('./modules/product/product.module').then((p) => p.ProductModule), canActivate: [AuthGuardService]},
  {path:'stocks', loadChildren: () => import('./modules/stock/stock.module').then((s) => s.StockModule), canActivate: [AuthGuardService]},
  {path:'account', component: UserComponent, canActivate: [AuthGuardService]},
  {path:'**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
