import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRegExp, ControlValidatorEntry, CustomValidators, FormValidator } from '@app/appValidators';
import { CostCenter } from 'src/models/cost-center/cost-center.model';
import { cloneDeep } from 'lodash';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-cost-center-new-edit',
  templateUrl: './cost-center-new-edit.component.html',
  styleUrls: ['./cost-center-new-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
],
})
export class CostCenterNewEditComponent implements OnInit {
 
  checkoutForm!: UntypedFormGroup;
  formValidator!: FormValidator;
  private valueEmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CostCenterNewEditComponent>, 
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public costCenter: CostCenter
  ) {
    this.setDialogSize();
  }

  private setDialogSize(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.dialogRef.updateSize('90vw', 'auto'); // Mobile size
      } else {
        this.dialogRef.updateSize('40vw', 'auto'); // Desktop size
      }
    });
  }

  ngOnInit(): void {
    this.initializeCostCenter();
    this.initializeForm();
  }

  private initializeCostCenter() {
    if (this.costCenter) {
      this.costCenter = cloneDeep(this.costCenter);
    } else {
      this.costCenter = new CostCenter();
    }
  }

  private initializeForm(): void {
    this.initializeFormGroup();
    this.initializeFormValidator();
    this.updateFormFromInput();
    this.subscribeToChanges();
  }

  private initializeFormGroup() {
    this.checkoutForm = this.formBuilder.group({
      name: null,
      totalCost: null,
      isVariable: null,
    });
  }

  private initializeFormValidator() {
    this.formValidator = new FormValidator(this.checkoutForm);
    this.formValidator
      .get('name')
      ?.setValidatorEntries([
        new ControlValidatorEntry(
          'required',
          'Requerido',
          () => Validators.required
        ),
        new ControlValidatorEntry(
          'onlyLetters',
          `Solo letras, números o "."`,
          CustomValidators.regexValidator,
          AppRegExp.onlyAlphaNumericsOrPunctuation
        ),
      ]);
    this.addNumberValidator('totalCost');
  }

  private addNumberValidator(key: string): void {
    this.formValidator.get(key)?.setValidatorEntries([
      new ControlValidatorEntry(
        'required',
        'Requerido',
        () => Validators.required
      ),
      new ControlValidatorEntry(
        'onlyNumbers',
        'Solo números',
        CustomValidators.regexValidator,
        AppRegExp.onlyNumbers
      ),
      new ControlValidatorEntry(
        'noZeroAtStart',
        '0 al principio',
        CustomValidators.regexValidator,
        AppRegExp.noZeroAtStart
      )
    ]);
  }

  private updateFormFromInput() {
    this.checkoutForm.patchValue({
      name: this.costCenter.name,
      totalCost: this.costCenter.totalCost,
      isVariable: this.costCenter.isVariable
    });
  }

  private subscribeToChanges() {
    this.checkoutForm
      .get('name')
      ?.valueChanges.subscribe((name: string) => (this.costCenter.name = name));
    this.checkoutForm
      .get('totalCost')
      ?.valueChanges.subscribe((totalCost: number) => (this.costCenter.totalCost = totalCost));
    this.checkoutForm
      .get('isVariable')
      ?.valueChanges.subscribe((isVariable: boolean) => (this.costCenter.isVariable = isVariable));
  }

  get disableSubmitButton(): boolean {
    return this.valueEmitted || !this.checkoutForm.valid;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    (this.costCenter as any).save().subscribe((costCenter: any) => {
      this.costCenter._id = costCenter._id;
      this.dialogRef.close(this.costCenter);
    });
    this.valueEmitted = true;
  }
}
