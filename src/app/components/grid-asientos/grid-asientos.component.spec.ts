import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAsientosComponent } from './grid-asientos.component';

describe('GridAsientosComponent', () => {
  let component: GridAsientosComponent;
  let fixture: ComponentFixture<GridAsientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridAsientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridAsientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
