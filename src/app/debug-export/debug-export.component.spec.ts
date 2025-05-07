import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugExportComponent } from './debug-export.component';

describe('DebugExportComponent', () => {
  let component: DebugExportComponent;
  let fixture: ComponentFixture<DebugExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
