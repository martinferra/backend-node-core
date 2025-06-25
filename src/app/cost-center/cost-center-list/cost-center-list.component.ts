import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CostCenterService } from 'src/models/cost-center/cost-center.service';
import { CostCenter } from 'src/models/cost-center/cost-center.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FloatingComponent } from '@app/floating-component';
import { CostCenterNewEditComponent } from '../cost-center-new-edit/cost-center-new-edit.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '@app/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-cost-center-list',
  templateUrl: './cost-center-list.component.html',
  styleUrls: ['./cost-center-list.component.scss'],
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
export class CostCenterListComponent implements FloatingComponent, OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  columnsToDisplay = ['name', 'actions'];

  costCenterList$!: Observable<MatTableDataSource<any>>;

  constructor(
    private costCenterService: CostCenterService,
    private dialog: MatDialog,
    private confirmationDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGridData();
  }

  loadGridData(costCenterFilterData: any = null): void {
    setTimeout(() => {
      this.paginator.pageIndex = 0;
  
      this.costCenterList$ = this.costCenterService
        .findGridData(costCenterFilterData || {})
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

  openCostCenterNewEditDialog(costCenter?: any): void {
    const dialogRef = this.dialog.open(CostCenterNewEditComponent, {
      data: costCenter,
    });

    dialogRef.afterClosed().subscribe(costCenter => {
      if (costCenter) {
        this.loadGridData();
      }
    });
  }

  remove(costCenter: CostCenter): void {
    this.confirmationDialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmación',
          message: `Se va a eliminar centro de costos "${costCenter.name}"`,
          cancelBtnText: 'Cancelar',
          confirmBtnText: 'Aceptar',
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          (costCenter as any).remove().subscribe(() => {
            this.loadGridData();
          });
        }
      });
  }

  // FloatingComponent implementation
  setElement?: (element: any) => void;
}
