import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroListComponent } from './registro-list.component';

describe('RegistroListComponent', () => {
  let component: RegistroListComponent;
  let fixture: ComponentFixture<RegistroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
