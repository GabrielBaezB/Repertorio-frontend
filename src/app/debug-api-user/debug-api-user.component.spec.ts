import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugApiUserComponent } from './debug-api-user.component';

describe('DebugApiUserComponent', () => {
  let component: DebugApiUserComponent;
  let fixture: ComponentFixture<DebugApiUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugApiUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugApiUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
