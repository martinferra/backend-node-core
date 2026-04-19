import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { ExpandableComponent } from '@app/expansion-list-editor/expandable-component.interface';
import { AvailableForMapping } from 'src/models/decorators/availableForMapping.decorator';
import { AppRegExp, ControlValidatorEntry, CustomValidators, FormValidator } from '@app/appValidators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CostCenterService } from 'src/models/cost-center/cost-center.service';
import { CostCenter } from 'src/models/cost-center/cost-center.model';
import { MatSelectModule } from '@angular/material/select';

@AvailableForMapping('CostCenterUsageNewEditComponent')
@Component({
  selector: 'app-cost-center-usage-new-edit',
  templateUrl: './cost-center-usage-new-edit.component.html',
  styleUrls: ['./cost-center-usage-new-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class CostCenterUsageNewEditComponent implements OnInit, ExpandableComponent {

  @Input() inputElement: any
  @Input() dialogMode: boolean = false
  @Input() inputClonning: boolean = true
  @Input() parentComponent: any;
  @Input() contextData: any;
  @Input() readOnly!: boolean;
  @Input() required!: boolean;
  @Input() markedAsTouched!: boolean;

  @Output() changedElementEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEditorEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterViewInitEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() contextChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  innerElement: any
  public checkoutForm!: UntypedFormGroup
  formValidator!: FormValidator
  costCenters!: CostCenter[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private costCenterService: CostCenterService,
  ) {
  }

  ngOnInit() {
    this.initializeForm();
    this.updateElementFromInput();
    this.loadCostCenters();
  }

  private initializeForm() {
    this.initializeFormGroup()
    this.initializeFormValidator()
    this.updateFormFromInput();
    this.subscribeToChanges()
  }

  private initializeFormGroup() {
    this.checkoutForm = this.formBuilder.group({
      costCenter: null,
      usagePercentage: null,
      qPercentage: null
    });
  }

  private initializeFormValidator() {

    this.formValidator = new FormValidator(this.checkoutForm)

    this.formValidator.get('costCenter')?.setValidatorEntries([
      new ControlValidatorEntry(
        'required',
        'Centro de costos requerido', 
        ()=>Validators.required
      )
    ])

    this.formValidator.get('usagePercentage')?.setValidatorEntries([
      new ControlValidatorEntry(
        'required',
        'Porcentaje requerido',
        ()=>Validators.required
      ),
      new ControlValidatorEntry(
        'onlyNumbers',
        'Solo números',
        CustomValidators.regexValidator,
        AppRegExp.onlyNumbers
      ),
    ])

    this.formValidator.get('qPercentage')?.setValidatorEntries([
      new ControlValidatorEntry(
        'required',
        'Porcentaje requerido',
        ()=>Validators.required
      ),
      new ControlValidatorEntry(
        'onlyNumbers',
        'Solo números',
        CustomValidators.regexValidator,
        AppRegExp.onlyNumbers
      ),
    ])

    if(this.markedAsTouched) {
      this.markAsTouched();
    }
  }

  private updateFormFromInput() {
    this.checkoutForm.patchValue({
      costCenter: this.inputElement.costCenter || null,
      usagePercentage: this.inputElement.usagePercentage || null,
      qPercentage: this.inputElement.qPercentage || null
    });
  }

  private loadCostCenters() {
    this.costCenterService.find().subscribe((costCenters) => {
      this.costCenters = costCenters;
    });
  }
  
  ngAfterViewInit(): void {
    this.afterViewInitEmitter.emit();
  }

  private subscribeToChanges() {
    this.checkoutForm.valueChanges.subscribe( values => {
      this.updateElementFromForm(values)
    });
  }

  private updateElementFromForm(values: any) {
    Object.assign(this.innerElement, values);
    this.changedElementEmitter.emit();
  }

  private updateElementFromInput() {
    if(this.inputClonning)
      this.innerElement = cloneDeep(this.inputElement);
    else
      this.innerElement = this.inputElement
  }

  public hasErrors(): boolean {
    let hasOwnErrors: boolean = this.formValidator? this.formValidator.hasErrors() : false
    return hasOwnErrors
  }

  public markAsTouched() {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const ctrl = this.checkoutForm.get(key);
      ctrl?.markAsTouched({ onlySelf: true });
    });
  }

  public getElement() {
    return this.innerElement
  }

  public get isEmpty(): boolean {
    // Check if both form controls are not null or undefined
    const costCenter = this.checkoutForm.get('costCenter')?.value;
    const usagePercentage = this.checkoutForm.get('usagePercentage')?.value;
    const qPercentage = this.checkoutForm.get('qPercentage')?.value;
    return costCenter == null && usagePercentage == null && qPercentage == null;
  };

  public updateContext(contextData: any): void {
  }

  compareEntitiesFn(o1: any, o2: any): any { 
    return o2? o1._id === o2._id : false
  }
}
