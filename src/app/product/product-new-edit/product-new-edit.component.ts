import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { AppRegExp, ControlValidatorEntry, CustomValidators, FormValidator } from '@app/appValidators';
import { CostCenter } from 'src/models/cost-center/cost-center.model';
import { Product } from 'src/models/product/product.model';
import { cloneDeep } from 'lodash';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProductFamily } from 'src/models/product-family/product-family.model';
import { ProductFamilyService } from 'src/models/product-family/product-family.service';
import { InputService } from 'src/models/input/input.service';
import { Input } from 'src/models/input/input.model';

@Component({
  selector: 'app-product-new-edit',
  templateUrl: './product-new-edit.component.html',
  styleUrls: ['./product-new-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule
],
})
export class ProductNewEditComponent implements OnInit {
 
  disableSubmitButton: boolean = true;
  private _editingCostCentersUsage: boolean = false;

  checkoutForm!: UntypedFormGroup;
  formValidator!: FormValidator;
  costCentersUsage: CostCenter[] = [];
  private valueEmitted: boolean = false;
  productFamilies: ProductFamily[] = [];
  availableInputs: Input[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProductNewEditComponent>, 
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private productFamilyService: ProductFamilyService,
    private inputService: InputService
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
    this.initializeProduct();
    this.initializeForm();
    this.loadProductFamilies();
    this.loadAvailableInputs();
    this.updateDisableSubmitButton();
  }

  private initializeProduct() {
    if (this.product) {
      this.product = cloneDeep(this.product);
    } else {
      this.product = new Product();
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
      sku: null,
      productFamily: null,
      unitPrice: null,
      unitPriceForResellers: null,
      projectedUnitsQ: null,
      projectedUnitsQForResellers: null,
      inputs: null,
      weight: null,
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
    this.formValidator
      .get('sku')
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
    this.formValidator
      .get('productFamily')
      ?.setValidatorEntries([
        new ControlValidatorEntry(
          'required',
          'Requerido',
          () => Validators.required
        )
      ]);
    this.addNumberValidator('unitPrice');
    this.addNumberValidator('unitPriceForResellers', false);
    this.addNumberValidator('projectedUnitsQ');
    this.addNumberValidator('projectedUnitsQForResellers', false);
    this.addNumberValidator('weight');
  }

  private addNumberValidator(key: string, required: boolean = true): void {
    var setValidatorEntries = required ? [
      new ControlValidatorEntry(
        'required',
        'Requerido',
        () => Validators.required
      )
    ] : [];
    setValidatorEntries.push(
      new ControlValidatorEntry(
        'onlyNumbers',
        'Solo números',
        CustomValidators.regexValidator,
        AppRegExp.decimalNumbers
      )
    );
    this.formValidator.get(key)?.setValidatorEntries(setValidatorEntries);
  }

  private updateFormFromInput() {
    this.checkoutForm.patchValue({
      name: this.product.name,
      sku: this.product.sku,
      unitPrice: this.product.unitPrice,
      unitPriceForResellers: this.product.unitPriceForResellers,
      projectedUnitsQ: this.product.projectedUnitsQ,
      projectedUnitsQForResellers: this.product.projectedUnitsQForResellers,
      productFamily: this.product.productFamily,
      inputs: this.product.inputs ?? [],
      weight: this.product.weight,
    });
  }

  private subscribeToChanges() {
    ['name', 'sku', 'unitPrice', 'unitPriceForResellers', 'projectedUnitsQ', 'projectedUnitsQForResellers', 'productFamily', 'inputs', 'weight']
      .forEach(controlName => this.subscribeToControlChanges(controlName));
  }

  private subscribeToControlChanges(controlName: string) {
    this.checkoutForm
      .get(controlName)
      ?.valueChanges.subscribe((value: any) => {
        this.product[controlName] = value;
        this.updateDisableSubmitButton();
      });
  }

  private loadProductFamilies(): void {
    this.productFamilyService.find({}).subscribe((families: ProductFamily[]) => {
      this.productFamilies = families;
    });
  }

  private loadAvailableInputs(): void {
    this.inputService.find({}).subscribe((inputs: Input[]) => {
      this.availableInputs = inputs;
    });
  }

  private updateDisableSubmitButton() {
    this.disableSubmitButton =
      this.valueEmitted ||
      !this.checkoutForm.valid ||
      this.editingCostCentersUsage
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    (this.product as any).save().subscribe((product: any) => {
      this.product._id = product._id;
      this.dialogRef.close(this.product);
    });
    this.valueEmitted = true;
  }

  compareEntitiesFn(o1: any, o2: any): any {
    return o2 ? o1._id === o2._id : false;
  }
}
