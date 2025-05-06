import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSearchComponent } from './registro-search.component';

describe('RegistroSearchComponent', () => {
  let component: RegistroSearchComponent;
  let fixture: ComponentFixture<RegistroSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
