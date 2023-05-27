import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import { Observable } from 'rxjs';
import { DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-asiento-palco',
  templateUrl: './asiento-palco.component.html',
  styleUrls: ['./asiento-palco.component.css']
})
export class AsientoPalcoComponent implements AfterViewInit, OnInit {
  information$: Observable<any> | undefined;

  constructor(private asientoService: FirebaseFirestoreService) {}

  async ngOnInit(): Promise<void> {
    this.information$ = await this.asientoService.getAsientoRealtime(this.information.fila, this.information.columna,this.information.evento);
    this.information$.forEach(asiento=>{
      if(asiento.length>0){
        this.information=asiento[0]
        console.log(this.information)
      }
      

    })
    
  }

  async ngAfterViewInit(): Promise<void> {}

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
}
