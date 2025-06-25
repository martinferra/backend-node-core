import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRegExp, ControlValidatorEntry, CustomValidators, FormValidator } from '@app/appValidators';
import { CostCenter } from 'src/models/cost-center/cost-center.model';
import { CostCenterUsage, ProductFamily } from 'src/models/product-family/product-family.model';
import { cloneDeep } from 'lodash';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CostCentersUsageEditorComponent } from '../cost-center-usage/cost-center-usage-editor/cost-center-usage-editor.component';

@Component({
  selector: 'app-product-family-new-edit',
  templateUrl: './product-family-new-edit.component.html',
  styleUrls: ['./product-family-new-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CostCentersUsageEditorComponent
],
})
export class ProductFamilyNewEditComponent implements OnInit {
 
  disableSubmitButton: boolean = true;
  private _editingCostCentersUsage: boolean = false;

  checkoutForm!: UntypedFormGroup;
  formValidator!: FormValidator;
  costCentersUsage: CostCenter[] = [];
  private valueEmitted: boolean = false;

  @ViewChild(CostCentersUsageEditorComponent, { static:false })
  costCentersUsageEditorComponent!: CostCentersUsageEditorComponent;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductFamilyNewEditComponent>, 
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public productFamily: ProductFamily
  ) {
    this.setDialogSize();
  }

  set editingCostCentersUsage(value: boolean) {
    this._editingCostCentersUsage = value;
    this.updateDisableSubmitButton();
  }
  get editingCostCentersUsage(): boolean {
    return this._editingCostCentersUsage;
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
    this.initializeProductFamily();
    this.initializeForm();
    this.updateDisableSubmitButton();
  }

  private initializeProductFamily() {
    if (this.productFamily) {
      this.productFamily = cloneDeep(this.productFamily);
    } else {
      this.productFamily = new ProductFamily();
    }
  }

  private initializeForm(): void {
    this.initializeFormGroup();
    this.initializeFormValidator();
    this.updateFormFromInput();
    this.subscribeToChanges();
    this.checkoutForm.statusChanges.subscribe(() => this.updateDisableSubmitButton());
  }

  private initializeFormGroup() {
    this.checkoutForm = this.formBuilder.group({
      name: null,
      price: null,
      variableCost: null,
      projectedQ: null,
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
    this.addNumberValidator('price');
    this.addNumberValidator('variableCost');
    this.addNumberValidator('projectedQ');
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
      name: this.productFamily.name,
      price: this.productFamily.price,
      variableCost: this.productFamily.variableCost,
      projectedQ: this.productFamily.projectedQ,
    });
  }

  private subscribeToChanges() {
    this.checkoutForm
      .get('name')
      ?.valueChanges.subscribe((name: string) => {
        this.productFamily.name = name;
        this.updateDisableSubmitButton();
      });
    this.checkoutForm
      .get('price')
      ?.valueChanges.subscribe((price: number) => {
        this.productFamily.price = price;
        this.updateDisableSubmitButton();
      });
    this.checkoutForm
      .get('variableCost')
      ?.valueChanges.subscribe((variableCost: number) => {
        this.productFamily.variableCost = variableCost;
        this.updateDisableSubmitButton();
      });
    this.checkoutForm
      .get('projectedQ')
      ?.valueChanges.subscribe((projectedQ: number) => {
        this.productFamily.projectedQ = projectedQ;
        this.updateDisableSubmitButton();
      });
  }

  updateCostCentersUsage(costCentersUsage: CostCenterUsage[]) {
    this.productFamily.costCentersUsage = costCentersUsage;
    this.updateDisableSubmitButton();
  }

  private updateDisableSubmitButton() {
    this.disableSubmitButton =
      this.valueEmitted ||
      !this.checkoutForm.valid ||
      this.editingCostCentersUsage ||
      !this.costCentersUsageEditorComponent ||
      this.costCentersUsageEditorComponent.hasErrors();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    (this.productFamily as any).save().subscribe((productFamily: any) => {
      this.productFamily._id = productFamily._id;
      this.dialogRef.close(this.productFamily);
    });
    this.valueEmitted = true;
  }
}
