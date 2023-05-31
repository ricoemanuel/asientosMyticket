import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { DocumentData } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    dinero:['', Validators.required],
  });
  constructor(private formBuilder: FormBuilder, private asientoService: FirebaseFirestoreService, private modalService: BsModalService) { }

  async ngOnInit(): Promise<void> {
    this.information$ = await this.asientoService.getAsientoRealtime(this.information.fila, this.information.columna, this.information.evento);
    this.information$.forEach(asiento => {
      if (asiento.length > 0) {
        this.information = asiento[0]
        console.log(this.information)
      }


    })

  }

  async ngAfterViewInit(): Promise<void> { }

  @Input() information: any;

  cambiarEstado() {
    if(this.information!=='inexistente'){
      if (this.information.estado === 'ocupado') {
        this.information.estado = 'libre';
      } else {
        this.information.estado = 'ocupado';
      }
      this.asientoService.actualizarAsiento(this.information);
    }

  
  }

  openModal(template: TemplateRef<any>) {
    this.cambiarEstado();
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    
  }
  cancelar(template: TemplateRef<any>) {
    this.cambiarEstado();
    this.modalRef?.hide()
    
  }
  Reservar() {
    
    this.information.cliente=this.formulario.value
    this.information.vendedor=localStorage.getItem("user")
    this.asientoService.actualizarAsiento(this.information);
    this.modalRef?.hide();
    
  }
}
