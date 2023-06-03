import { Component, OnInit, TemplateRef } from '@angular/core';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.css']
})
export class ListaEventosComponent implements OnInit{
  eventos:any[]=[]
  lista:boolean[]=[]
  formulario = this.formBuilder.group({
    nombre: ['', Validators.required],
  });
  modalRef?: BsModalRef;
  eventoActual:string|undefined;
  constructor(private modalService: BsModalService, private asientoService: FirebaseFirestoreService,private router: Router, private formBuilder: FormBuilder){}
  async ngOnInit(): Promise<void> {
    let eventos=await this.asientoService.getEventos()
    eventos.forEach(evento=>{
      this.lista.push(false);
      this.eventos=evento
    })
    
  }
  abrirEvento(id:string){
    this.router.navigate(['eventos', id]);
  }
  editarEvento(id:string){
    this.router.navigate(['eventos/editar', id]);
  }
  anadirVendedor(template: TemplateRef<any>,eventoId:string) {
    this.modalRef = this.modalService.show(template);
    this.eventoActual=eventoId

  }
  GuardarVendedor(){
    if((this.formulario.value.nombre!=undefined && this.formulario.value.nombre!="") && this.eventoActual!=undefined){
      let vendedor={
        'nombre':this.formulario.value.nombre,
        'evento':this.eventoActual
      }
      this.asientoService.setVendedor(vendedor).then(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Enhorabuena!',
          text: 'Cambios guardados',
          showConfirmButton: false,
          timer:1500
        }).then(()=>{
          this.modalRef?.hide()
        })
      })
    }
    
  }

}
