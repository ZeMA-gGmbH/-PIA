import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistdetailComponent } from './checklistdetail.component';

describe('ChecklistdetailComponent', () => {
  let component: ChecklistdetailComponent;
  let fixture: ComponentFixture<ChecklistdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
