import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ProductFormComponent } from 'src/app/components/product/product-form/product-form.component';
import { ProductTableComponent } from 'src/app/components/product/product-table/product-table.component';
import { ProductService } from 'src/app/services/product/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatSelectModule } from '@angular/material/select';
import localeDE  from '@angular/common/locales/de';

registerLocaleData(localeDE)

@NgModule({
  declarations: [
    ProductFormComponent,
    ProductTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    ProductService,
    StockService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})
export class ProductModule { }
