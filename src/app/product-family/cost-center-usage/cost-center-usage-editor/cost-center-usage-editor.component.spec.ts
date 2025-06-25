import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraLotsEditorComponent } from './extra-lots-editor.component';

describe('ExtraLotsEditorComponent', () => {
  let component: ExtraLotsEditorComponent;
  let fixture: ComponentFixture<ExtraLotsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraLotsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraLotsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
