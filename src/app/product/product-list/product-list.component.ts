import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from 'src/models/product/product.service';
import { Product } from 'src/models/product/product.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FloatingComponent } from '@app/floating-component';
import { ProductNewEditComponent } from '../product-new-edit/product-new-edit.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '@martinferra/frontend-common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class ProductListComponent implements FloatingComponent, OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  columnsToDisplay = ['name', 'sku', 'productFamily', 'actions'];

  productList$!: Observable<MatTableDataSource<any>>;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private confirmationDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGridData();
  }

  loadGridData(productFilterData: any = null): void {
    setTimeout(() => {
      this.paginator.pageIndex = 0;
  
      this.productList$ = this.productService
        .findGridData(productFilterData || {})
        .pipe(map((productFamilies: Array<any>) => this.createDataSource(productFamilies)));
   });
  }

  private createDataSource(list: Array<any>): MatTableDataSource<any> {
    let mtds = new MatTableDataSource<any>(list);
    this.paginator.length = list.length;
    this.paginator.pageSize = 10;
    this.paginator.pageSizeOptions = [3, 5, 10];
    mtds.paginator = this.paginator;
    return mtds;
  }

  openProductNewEditDialog(product?: any): void {
    const dialogRef = this.dialog.open(ProductNewEditComponent, {
      data: product,
    });

    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.loadGridData();
      }
    });
  }

  remove(product: Product): void {
    this.confirmationDialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmación',
          message: `Se va a eliminar el producto "${product.name}"`,
          cancelBtnText: 'Cancelar',
          confirmBtnText: 'Aceptar',
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          (product as any).remove().subscribe(() => {
            this.loadGridData();
          });
        }
      });
  }

  // FloatingComponent implementation
  setElement?: (element: any) => void;
}
