import { Component, OnInit } from '@angular/core';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.css']
})
export class ListaEventosComponent implements OnInit{
  eventos:any[]=[]
  lista:boolean[]=[]
  constructor(private asientoService: FirebaseFirestoreService,private router: Router){}
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
 

}
