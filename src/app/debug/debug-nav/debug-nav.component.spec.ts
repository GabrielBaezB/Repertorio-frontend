import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugNavComponent } from './debug-nav.component';

describe('DebugNavComponent', () => {
  let component: DebugNavComponent;
  let fixture: ComponentFixture<DebugNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
