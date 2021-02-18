import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrpChartComponent } from './nrp-chart.component';

describe('NrpChartComponent', () => {
  let component: NrpChartComponent;
  let fixture: ComponentFixture<NrpChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NrpChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
