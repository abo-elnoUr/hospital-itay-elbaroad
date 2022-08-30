import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyDataComponent } from './pharmacy-data.component';

describe('PharmacyDataComponent', () => {
  let component: PharmacyDataComponent;
  let fixture: ComponentFixture<PharmacyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
