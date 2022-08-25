import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenPdfComponent } from './gen-pdf.component';

describe('GenPdfComponent', () => {
  let component: GenPdfComponent;
  let fixture: ComponentFixture<GenPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
