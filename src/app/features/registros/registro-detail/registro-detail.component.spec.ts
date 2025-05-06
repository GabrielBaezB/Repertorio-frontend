import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDetailComponent } from './registro-detail.component';

describe('RegistroDetailComponent', () => {
  let component: RegistroDetailComponent;
  let fixture: ComponentFixture<RegistroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
