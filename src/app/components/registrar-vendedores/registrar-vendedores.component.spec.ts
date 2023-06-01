import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarVendedoresComponent } from './registrar-vendedores.component';

describe('RegistrarVendedoresComponent', () => {
  let component: RegistrarVendedoresComponent;
  let fixture: ComponentFixture<RegistrarVendedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarVendedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
