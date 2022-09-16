import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StockFormComponent } from 'src/app/components/stock/stock-form/stock-form.component';
import { StockTableComponent } from 'src/app/components/stock/stock-table/stock-table.component';

const stockRoutes: Routes = [
  {path: '', component: StockTableComponent},
  {path:'update/:id', component: StockFormComponent}
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(stockRoutes)
  ]
})
export class StockRoutingModule { }
