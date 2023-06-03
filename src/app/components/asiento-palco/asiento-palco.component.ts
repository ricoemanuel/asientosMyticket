import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { DocumentData } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-asiento-palco',
  templateUrl: './asiento-palco.component.html',
  styleUrls: ['./asiento-palco.component.css']
})
export class AsientoPalcoComponent implements AfterViewInit, OnInit {
  information$: Observable<any> | undefined;
  modalRef?: BsModalRef;
  formulario = this.formBuilder.group({
    nombre: ['', Validators.required],
    metodo: ['', Validators.required],
    correo: ['', Validators.required],
    tipo: ['', Validators.required],
    dinero: ['', Validators.required],
  });
  vendedor: FormControl = new FormControl('');
  map: boolean = false;
  cont1: number = 0
  firstTime: boolean = true
  vendedores: any[] = []
  constructor(private router: Router, private formBuilder: FormBuilder, private asientoService: FirebaseFirestoreService, private modalService: BsModalService) { }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem("mapa") == "true") {
      this.map = true;
    }
    this.information$ = await this.asientoService.getAsientoRealtime(this.information.fila, this.information.columna, this.information.evento);
    this.information$.forEach(async asiento => {
      if (asiento.length > 0) {
        this.information = asiento[0]

        let cont2 = parseInt(localStorage.getItem(this.information['zona']['nombreZona']) ?? '0');
        cont2++
        if (this.firstTime) {
          this.firstTime = false
          this.cont1 = cont2
        }
        localStorage.setItem(this.information['zona']['nombreZona'], cont2.toString());
        this.vendedores = (await this.asientoService.getVendedores(this.information.evento)).docs
        if (this.information.vendedor != "null") {
          console.log(this.information)
          this.formulario.setValue({
            nombre: this.information["cliente"]["nombre"],
            metodo: this.information["cliente"]["metodo"],
            correo: this.information["cliente"]["correo"],
            tipo: this.information["cliente"]["tipo"],
            dinero: this.information["cliente"]["dinero"],
          })
          this.vendedor.patchValue(this.information.vendedor)
        }

      }
    })




  }

  async ngAfterViewInit(): Promise<void> {

  }

  @Input() information: any;

  cambiarEstado() {
    if (this.information !== 'inexistente') {
      if (this.information.estado === 'ocupado') {
        this.information.estado = 'libre';
      } else {
        this.information.estado = 'ocupado';
      }
      this.asientoService.actualizarAsiento(this.information);
    }


  }

  openModal(template: TemplateRef<any>) {

    if (this.information['estado'] != "ocupado") {
      this.cambiarEstado();

    }
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });


  }
  cancelar(template: TemplateRef<any>) {
    if (this.information['vendedor'] != "null") {
      if (this.information['estado'] != "ocupado") {
        this.cambiarEstado();

      }

    } else {
      this.cambiarEstado();
    }
    this.modalRef?.hide()

  }
  Reservar() {
   
    if (this.vendedor.value != "" && this.vendedor.value != undefined && this.vendedor.value !="oXTcrguOoYZ5q18dIFyeCtjQvVs2") {
      this.information.cliente = this.formulario.value
      this.information.vendedor = this.vendedor.value
      this.asientoService.actualizarAsiento(this.information);
      this.modalRef?.hide();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes seleccionar al menos un vendedor'

      })
    }


  }
}
