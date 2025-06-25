import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartData, ChartOptions } from 'chart.js';
import { ProductFamily } from 'src/models/product-family/product-family.model';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip } from 'chart.js';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ParameterEditorComponent } from './parameter-editor/parameter-editor.component';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IndicatorViewComponent } from './indicator-view/indicator-view.component';

// Register Chart.js controllers and elements
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-product-family-chart',
  templateUrl: './product-family-chart.component.html',
  styleUrls: ['./product-family-chart.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseChartDirective,
    MatButtonModule,
    MatIconModule,
    ParameterEditorComponent,
    IndicatorViewComponent,
  ],
})
export class ProductFamilyChartComponent implements OnInit {

  checkoutForm!: UntypedFormGroup;
  chartOptions!: ChartOptions<'line'>;
  chartData!: ChartData<'line'>;

  // Editable values and their original values
  price!: number;
  variableCost!: number;
  fixedCost!: number;
  projectedQ!: number;

  breakEvenPoint!: number;
  expectedEarnings!: number;
  breakEvenPercentage!: number;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductFamilyChartComponent>, 
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public productFamily: ProductFamily
  ) {
    this.setDialogSize();
    this.initEditableValues();
    this.chartOptions = this.getChartOptions();
  }

  private initEditableValues() {
    this.price = this.productFamily.price;
    this.variableCost = this.productFamily.variableCost;
    this.fixedCost = this.productFamily.fixedCost;
    this.projectedQ = this.productFamily.projectedQ;
  }

  private setDialogSize(): void {
      this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
        if (result.matches) {
          this.dialogRef.updateSize('90vw', 'auto'); // Mobile size
        } else {
          this.dialogRef.updateSize('80vw', 'auto'); // Desktop size
        }
      });
    }

  ngOnInit(): void {
    this.initializeForm();
    this.updateChart();
  }

  private initializeForm(): void {
    this.initializeFormGroup();
    this.updateFormFromInput();
    this.subscribeToChanges();
  }

  private initializeFormGroup() {
    this.checkoutForm = this.formBuilder.group({
      price: null,
      variableCost: null,
      fixedCost: null,
      projectedQ: null,
    });
  }

  private updateFormFromInput() {
    this.checkoutForm.patchValue({
      price: this.price,
      variableCost: this.variableCost,
      fixedCost: this.fixedCost,
      projectedQ: this.projectedQ,
    });
  }

  private subscribeToChanges() {
    this.checkoutForm
      .get('price')
      ?.valueChanges.subscribe((price: number) => {
        this.price = price;
      });
    this.checkoutForm
      .get('variableCost')
      ?.valueChanges.subscribe((variableCost: number) => {
        this.variableCost = variableCost;
      });
    this.checkoutForm
      .get('fixedCost')
      ?.valueChanges.subscribe((fixedCost: number) => {
        this.fixedCost = fixedCost;
      });
    this.checkoutForm
      .get('projectedQ')
      ?.valueChanges.subscribe((projectedQ: number) => {
        this.projectedQ = projectedQ;
      });
    this.checkoutForm.valueChanges.subscribe(() => {
      this.updateChart();
    });
  }

  resetValues() {
    this.price = this.productFamily.price;
    this.variableCost = this.productFamily.variableCost;
    this.fixedCost = this.productFamily.fixedCost;
    this.projectedQ = this.productFamily.projectedQ;
    this.updateFormFromInput();
    this.updateChart();
  }

  updateChart() {
    this.chartData = this.getChartData();
  }

  private getChartOptions(): ChartOptions<'line'> {
    const chartTextColor =  'rgba(255, 255, 255, 0.5)';
    const gridColor =  'rgba(255, 255, 255, 0.15)';
    return {
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: chartTextColor,
          },
        },
        tooltip: {
          titleColor: chartTextColor,
          bodyColor: chartTextColor,
        },
      },
      scales: {
        x: {
          type: 'linear', // <-- Make x axis linear
          ticks: {
            color: chartTextColor,
          },
          title: {
            color: chartTextColor,
          },
          grid: {
            color: gridColor, // Set grid color
          },
        },
        y: {
          ticks: {
            color: chartTextColor,
          },
          title: {
            color: chartTextColor,
          },
          grid: {
            color: gridColor, // Set grid color
          },
        },
      },
    };
  }

  private getChartData(): ChartData<'line'> {

    // Calculate break-even point
    this.breakEvenPoint = 0;
    if (this.price > this.variableCost) {
      this.breakEvenPoint = this.fixedCost / (this.price - this.variableCost);
    }
    const breakEvenValue = this.breakEvenPoint * this.price;

    // Calculate expected earnings for projected production
    this.expectedEarnings = (this.price - this.variableCost) * this.projectedQ - this.fixedCost;

    // Calculate break-even percentage over projected production
    if (this.projectedQ > 0) {
      this.breakEvenPercentage = (this.breakEvenPoint / this.projectedQ) * 100;
    } else {
      this.breakEvenPercentage = 0;
    }

    const q = [0, this.projectedQ];
    const revenue = [0, this.projectedQ * this.price];
    const totalCost = [this.fixedCost, this.fixedCost + this.projectedQ * this.variableCost];

    return {
      labels: q,
      datasets: [
        {
          label: 'Ing. p/ventas',
          data: revenue,
          borderColor: '#29c329',
          backgroundColor: 'rgba(0, 255, 0, 0.15)',
          borderWidth: 2,
          pointRadius: 0,
          order: 2,
        },
        {
          label: 'Costo total',
          data: totalCost,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 0, 0, 0.45)',
          borderWidth: 2,
          pointRadius: 0,
          order: 2,
        },
        {
          label: 'Pto. de equilibrio',
          data: [
            { x: this.breakEvenPoint, y: breakEvenValue }
          ],
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.45)',
          borderWidth: 1,
          pointBorderColor: 'blue',
          pointBackgroundColor: 'blue',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false,
          order: 1,
        },
      ],
    };
  }

  get breakEvenPointStr(): string {
    return this.breakEvenPoint ?
      Math.round(this.breakEvenPoint)
        .toString()
        .replace('.', '')
        .replace(',', '') :
      'N/A';
  }
}
