import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parameter-editor',
  standalone: true,
  templateUrl: './parameter-editor.component.html',
  styleUrl: './parameter-editor.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ParameterEditorComponent),
      multi: true
    }
  ]
})
export class ParameterEditorComponent implements ControlValueAccessor {

  stepOptions = [
    { label: '1%', value: 1 },
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '20%', value: 20 }
  ];

  defaultStepPerc: number = 5;
  stepPerc: number = this.defaultStepPerc;

  value!: number;
  step!: number;
  disabled = false;
  originalValue!: number;

  @Input() label!: string;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  increment(factor = 1) {
    this.value = Math.round((this.value + this.step * factor) * 100) / 100;
    this.onChange(this.value);
    this.onTouched();
  }

  decrement() {
    this.increment(-1);
  }

  onStepPercChange(event: Event) {
    const eventValue = +(event.target as HTMLSelectElement).value;
    this.stepPerc = eventValue;
    this.step = this.originalValue * this.stepPerc / 100;
  }

  onInputChange(event: Event) {
    const eventValue = (event.target as HTMLInputElement).value;
    this.value = +eventValue;
    this.onChange(this.value);
    this.onTouched();
  }

  get showDelta(): boolean {
    return this.value !== undefined && this.originalValue !== undefined && this.value !== this.originalValue;
  }

  get deltaString(): string {
    const delta = this.value - this.originalValue;
    return Math.round(Math.abs(delta)).toString();
  }

  get deltaPercentageString(): string {
    const delta = this.value - this.originalValue;
    return Math.round(Math.abs((delta / this.originalValue) * 100)).toString() + '%';
  }

  get deltaIsPositive(): boolean {
    return (this.value - this.originalValue) > 0;
  }

  // ControlValueAccessor methods
  writeValue(value: number): void {
    this.value = value;
    this.originalValue = value;
    this.stepPerc = this.defaultStepPerc; // Reset to default step percentage
    this.step = this.originalValue * this.defaultStepPerc / 100; // Reset step to default
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
