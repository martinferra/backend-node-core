import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-indicator-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './indicator-view.component.html',
  styleUrl: './indicator-view.component.scss',
})
export class IndicatorViewComponent implements OnInit, OnChanges {
  @Input() label!: string;
  @Input() value!: number;
  @Input() showDeltaPercentage: boolean = true;
  @Input() valuePrefix: string = '';
  @Input() valueSuffix: string = '';

  originalValue!: number;

  ngOnInit() {
    // No need to set originalValue here, handled in ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('value' in changes && this.originalValue === undefined && this.value !== undefined) {
      this.originalValue = this.value;
    }
  }

  get showDelta(): boolean {
    return this.value !== undefined && this.originalValue !== undefined && this.value !== this.originalValue;
  }

  get valueString(): string {
    // The value is rounded to 2 decimal places
    return this.value?
      this.valuePrefix + this.value.toFixed(2) + this.valueSuffix
      : '';
  }

  get deltaString(): string {
    const delta = this.value - this.originalValue;
    return this.valuePrefix + Math.round(Math.abs(delta)).toString() + this.valueSuffix;
  }

  get deltaPercentageString(): string {
    const delta = this.value - this.originalValue;
    return ' (' + Math.round(Math.abs((delta / this.originalValue) * 100)).toString() + '%)';
  }

  get deltaIsPositive(): boolean {
    return (this.value - this.originalValue) > 0;
  }
}
