import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrpBacklogComponent } from './nrp-backlog.component';

describe('NrpBacklogComponent', () => {
  let component: NrpBacklogComponent;
  let fixture: ComponentFixture<NrpBacklogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NrpBacklogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrpBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
