import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRegExp, ControlValidatorEntry, CustomValidators, FormValidator } from '@app/appValidators';
import { cloneDeep } from 'lodash';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Input } from 'src/models/input/input.model';

@Component({
  selector: 'app-input-new-edit',
  templateUrl: './input-new-edit.component.html',
  styleUrls: ['./input-new-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
})
export class InputNewEditComponent implements OnInit {
 
  disableSubmitButton: boolean = true;

  checkoutForm!: UntypedFormGroup;
  formValidator!: FormValidator;
  private valueEmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<InputNewEditComponent>, 
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public input: Input
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
    this.initializeInput();
    this.initializeForm();
    this.updateDisableSubmitButton();
  }

  private initializeInput() {
    if (this.input) {
      this.input = cloneDeep(this.input);
    } else {
      this.input = new Input();
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
      cost: null,
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
    this.addNumberValidator('cost');
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
        AppRegExp.decimalNumbers
      )
    ]);
  }

  private updateFormFromInput() {
    this.checkoutForm.patchValue({
      name: this.input.name,
      sku: this.input.sku,
      cost: this.input.cost
    });
  }

  private subscribeToChanges() {
    this.checkoutForm
      .get('name')
      ?.valueChanges.subscribe((name: string) => {
        this.input.name = name;
        this.updateDisableSubmitButton();
      });
    this.checkoutForm
      .get('sku')
      ?.valueChanges.subscribe((sku: string) => {
        this.input.sku = sku;
        this.updateDisableSubmitButton();
      });
    this.checkoutForm
      .get('cost')
      ?.valueChanges.subscribe((cost: number) => {
        this.input.cost = cost;
        this.updateDisableSubmitButton();
      });
  }

  private updateDisableSubmitButton() {
    this.disableSubmitButton =
      this.valueEmitted ||
      !this.checkoutForm.valid
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    (this.input as any).save().subscribe((input: any) => {
      this.input._id = input._id;
      this.dialogRef.close(this.input);
    });
    this.valueEmitted = true;
  }
}
