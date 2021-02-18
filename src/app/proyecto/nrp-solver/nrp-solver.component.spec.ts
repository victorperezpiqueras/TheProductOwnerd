import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrpSolverComponent } from './nrp-solver.component';

describe('NrpSolverComponent', () => {
  let component: NrpSolverComponent;
  let fixture: ComponentFixture<NrpSolverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NrpSolverComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrpSolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
