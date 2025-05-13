import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugBaseComponent } from './debug-base.component';

describe('DebugBaseComponent', () => {
  let component: DebugBaseComponent;
  let fixture: ComponentFixture<DebugBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
