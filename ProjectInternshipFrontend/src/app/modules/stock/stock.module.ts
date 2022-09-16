import { NgModule } from '@angular/core';
import { StockService } from 'src/app/services/stock/stock.service';
import { StockFormComponent } from 'src/app/components/stock/stock-form/stock-form.component';
import { StockRoutingModule } from './stock-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/services/product/product.service';
import { StockTableComponent } from 'src/app/components/stock/stock-table/stock-table.component';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [
    StockFormComponent,
    StockTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StockRoutingModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  providers: [
    StockService,
    ProductService
  ]
})
export class StockModule { }
