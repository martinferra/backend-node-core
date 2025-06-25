import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ExpandableListComponent } from '@app/expansion-list-editor/expandable-list-component.interface';
import { ExpansionListEditorComponent } from '@app/expansion-list-editor/expansion-list-editor.component';
import { CostCenterUsage } from 'src/models/product-family/product-family.model';

@Component({
  selector: 'app-cost-centers-usage-editor',
  template: `
    <app-expansion-list-editor 
      [componentSpec]="componentSpec"
      [datasource]="parentElement.costCentersUsage"
      [cardFormat]="cardFormat"
      [editingEmitter]="editingEmitter"
      (listChangeEmitter)="listChangeEmitter.emit($event)"
      (elementOperationEmitter)="elementOperationEmitter.emit($event)">
    </app-expansion-list-editor>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ExpansionListEditorComponent
  ]
})
export class CostCentersUsageEditorComponent implements OnInit, ExpandableListComponent {

  @Input() datasource!: any[]
  @Input() parentElement: any = null;
  @Input() componentSpec: any = null;
  @Input() cardFormat: boolean = true;
  @Input() parentComponent: any = null;
  @Input() contextData: any = {};
  @Input() oneRequired!: boolean;
  @Input() allowsSingleMode!: boolean;

  @Output() listChangeEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() editingEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() elementOperationEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(ExpansionListEditorComponent, { static:false }) 
  private expansionListEditor!: ExpansionListEditorComponent;

  constructor(
  ) {}

  ngOnInit() {

    this.parentElement.costCentersUsage ??= [];

    this.componentSpec = {
      entityClass: CostCenterUsage,
      parentData: this.parentElement,
      headerSpec: {
        title: 'Centros de Costo',
      },
      getElementTitle: (element: CostCenterUsage)=>element.costCenter?.name ?? '',
      getElementDescription: (element: CostCenterUsage)=>element.usagePercentage ?? ''
    }
  }

  public hasErrors() {
    return this.expansionListEditor.hasErrors()
  }

}
