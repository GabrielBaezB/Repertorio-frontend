import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugApiRolesComponent } from './debug-api-roles.component';

describe('DebugApiRolesComponent', () => {
  let component: DebugApiRolesComponent;
  let fixture: ComponentFixture<DebugApiRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugApiRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugApiRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
