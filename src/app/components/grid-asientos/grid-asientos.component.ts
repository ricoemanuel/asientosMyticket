import { Component, OnInit } from '@angular/core';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-grid-asientos',
  templateUrl: './grid-asientos.component.html',
  styleUrls: ['./grid-asientos.component.css']
})
export class GridAsientosComponent implements OnInit{
  
  is:number=0
  js:number=0
  estado:string="inexistente"
  evento:string=""
  zona={'hexaColor':'white','nombreZona':'libre'}
  constructor(private asientoService: FirebaseFirestoreService,private route: ActivatedRoute){}
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.evento = params['id'];
    });
    let evento=await this.asientoService.getEvento(this.evento)
    if(evento!=undefined){
      this.is=evento["filas"]
      this.js=evento["columnas"]
    }
    
  }

  Array(number:number):number[]{
    let array:number[]=[]
    for (let i=0;i<number;i++){
      array.push(0)
    }
    return array
  }
  
}
