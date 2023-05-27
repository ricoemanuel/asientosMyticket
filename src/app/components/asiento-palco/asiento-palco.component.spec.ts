import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsientoPalcoComponent } from './asiento-palco.component';

describe('AsientoPalcoComponent', () => {
  let component: AsientoPalcoComponent;
  let fixture: ComponentFixture<AsientoPalcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsientoPalcoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsientoPalcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
