import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnlageDetailsComponent } from './anlage-details.component';

describe('AnlageDetailsComponent', () => {
  let component: AnlageDetailsComponent;
  let fixture: ComponentFixture<AnlageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnlageDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnlageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
