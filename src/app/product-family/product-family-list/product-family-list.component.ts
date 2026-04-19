import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductFamilyService } from 'src/models/product-family/product-family.service';
import { ProductFamily } from 'src/models/product-family/product-family.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FloatingComponent } from '@app/floating-component';
import { ProductFamilyChartComponent } from '../product-family-chart/product-family-chart.component';
import { ProductFamilyNewEditComponent } from '../product-family-new-edit/product-family-new-edit.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '@martinferra/frontend-common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-family-list',
  templateUrl: './product-family-list.component.html',
  styleUrls: ['./product-family-list.component.scss'],
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
export class ProductFamilyListComponent implements FloatingComponent, OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  columnsToDisplay = ['name', 'actions'];

  productFamilyList$!: Observable<MatTableDataSource<any>>;

  constructor(
    private productFamilyService: ProductFamilyService,
    private dialog: MatDialog,
    private confirmationDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGridData();
  }

  loadGridData(productFamilyFilterData: any = null): void {
    setTimeout(() => {
      this.paginator.pageIndex = 0;
  
      this.productFamilyList$ = this.productFamilyService
        .findGridData(productFamilyFilterData || {})
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

  openChart(productFamily: ProductFamily): void {
    // Open chart dialog
    const dialogRef = this.dialog.open(ProductFamilyChartComponent, {
      data: productFamily,
    });
  }

  openProductFamilyNewEditDialog(productFamily?: any): void {
    const dialogRef = this.dialog.open(ProductFamilyNewEditComponent, {
      data: productFamily,
    });

    dialogRef.afterClosed().subscribe(productFamily => {
      if (productFamily) {
        this.loadGridData();
      }
    });
  }

  remove(productFamily: ProductFamily): void {
    this.confirmationDialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmación',
          message: `Se va a eliminar la familia "${productFamily.name}"`,
          cancelBtnText: 'Cancelar',
          confirmBtnText: 'Aceptar',
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          (productFamily as any).remove().subscribe(() => {
            this.loadGridData();
          });
        }
      });
  }

  // FloatingComponent implementation
  setElement?: (element: any) => void;
}
