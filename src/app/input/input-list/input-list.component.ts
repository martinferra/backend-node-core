import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InputService } from 'src/models/input/input.service';
import { Input } from 'src/models/input/input.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FloatingComponent } from '@app/floating-component';
import { InputNewEditComponent } from '../input-new-edit/input-new-edit.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '@martinferra/frontend-common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.scss'],
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
export class InputListComponent implements FloatingComponent, OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  columnsToDisplay = ['name', 'sku', 'actions'];

  inputList$!: Observable<MatTableDataSource<any>>;

  constructor(
    private inputService: InputService,
    private dialog: MatDialog,
    private confirmationDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGridData();
  }

  loadGridData(inputFilterData: any = null): void {
    setTimeout(() => {
      this.paginator.pageIndex = 0;
  
      this.inputList$ = this.inputService
        .findGridData(inputFilterData || {})
        .pipe(map((inputs: Array<any>) => this.createDataSource(inputs)));
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

  openInputNewEditDialog(input?: any): void {
    const dialogRef = this.dialog.open(InputNewEditComponent, {
      data: input,
    });

    dialogRef.afterClosed().subscribe(input => {
      if (input) {
        this.loadGridData();
      }
    });
  }

  remove(input: Input): void {
    this.confirmationDialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmación',
          message: `Se va a eliminar el insumo "${input.name}"`,
          cancelBtnText: 'Cancelar',
          confirmBtnText: 'Aceptar',
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          (input as any).remove().subscribe(() => {
            this.loadGridData();
          });
        }
      });
  }

  // FloatingComponent implementation
  setElement?: (element: any) => void;
}
