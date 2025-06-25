import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CostCenterUsageNewEditComponent } from './cost-center-usage-new-edit.component';

describe('CostCenterUsageNewEditComponent', () => {
  let component: CostCenterUsageNewEditComponent;
  let fixture: ComponentFixture<CostCenterUsageNewEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CostCenterUsageNewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterUsageNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
