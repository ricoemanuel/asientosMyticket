import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import Swal from 'sweetalert2';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.component.html',
  styleUrls: ['./registrar-evento.component.css']
})
export class RegistrarEventoComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    nombre: ['', Validators.required],
    columnas: ['', Validators.required],
    filas: ['', Validators.required],
  });
  @ViewChild('stepper') stepper: MatStepper | undefined;
  secondFormGroup = this._formBuilder.group({
    nombreZona: '',
    hexaColor: ''
  });

  SelectZonas = new FormGroup({
    zonaSeleccionada: new FormControl('')
  });
  disabled: boolean = true;
  public color: ThemePalette = 'primary';
  public touchUi = false;

  isLinear = false;
  arrayAsientos: any[] = []
  constructor(private _formBuilder: FormBuilder,
    private asientoService: FirebaseFirestoreService,
  ) { }
  asientoLibre: any[][] = [];
  
  ngOnInit(): void {

  }
  async submit() {
    for (let i=0;i<this.zonas.length;i++){
      this.zonas[i]["hexaColor"]='#'+this.zonas[i]["hexaColor"]['hex']
    }
    console.log(this.zonas)
    let obj={
      'columnas':this.firstFormGroup.value.columnas,
      'filas':this.firstFormGroup.value.filas,
      'nombre':this.firstFormGroup.value.nombre,
      'zonas':this.zonas
    }
    let evento = await this.asientoService.addEvento(obj)
    let id = evento.id

    if (this.firstFormGroup.value.filas != undefined && this.firstFormGroup.value.columnas != undefined) {
      for (let i = 0; i < parseInt(this.firstFormGroup.value.filas); i++) {
        for (let j = 0; j < parseInt(this.firstFormGroup.value.columnas); j++) {
          if (this.asientoLibre[i][j]["nombreZona"]!='libre') {
            let objZona={'nombreZona':this.asientoLibre[i][j]['nombreZona'],'hexaColor':this.asientoLibre[i][j]['hexaColor']}
            let asiento: any = { 'estado': 'libre', 'fila': i, 'columna': j, 'evento': id,'zona':objZona};
            await this.asientoService.setAsiento(asiento)
          }

        }
      }
    }
  }
  Array(number: any): number[] {
    let array: number[] = []
    number = parseInt(number)
    for (let i = 0; i < number; i++) {
      array.push(0)
    }
    return array
  }

  cambiarEstadoAsiento(fila: number, columna: number) {
    console.log(this.SelectZonas.value.zonaSeleccionada)
    if(this.SelectZonas.value.zonaSeleccionada!=undefined){
      if(this.SelectZonas.value.zonaSeleccionada!=''){
        console.log(true)
        if(this.SelectZonas.value.zonaSeleccionada=='white'){
          this.asientoLibre[fila][columna] = {'nombreZona':'libre','hexaColor':'white'};
          console.log(true)
        }else{
          console.log(true)
          if(this.asientoLibre[fila][columna]['nombreZona']=="libre"){
            console.log(true)
            this.asientoLibre[fila][columna]=this.SelectZonas.value.zonaSeleccionada
          }else{
            console.log(true)
            this.asientoLibre[fila][columna] = {'nombreZona':'libre','hexaColor':'white'};
          }
          
          
        }
        
      }
    }
    console.log(this.asientoLibre)
  }
  asignar() {
    if (this.firstFormGroup.value.filas != undefined && this.firstFormGroup.value.columnas != undefined) {
      for (let i = 0; i < parseInt(this.firstFormGroup.value.filas); i++) {
        this.asientoLibre[i] = [];
        
        for (let j = 0; j < parseInt(this.firstFormGroup.value.columnas); j++) {
          this.asientoLibre[i][j] = {'nombreZona':'libre','hexaColor':'white'};
          
        }
      }
    }
  }
  cantidadContenido: number = 1;
  zonas: any[] = []
  anadirZona() {
    this.zonas.push(this.secondFormGroup.value)
    console.log(this.zonas)
    this.secondFormGroup.reset()
  }
  editing: boolean = false
  EditingIndex: number = -1
  editarZona(index: number) {
    this.EditingIndex = index
    let nombre = this.zonas[index]["nombreZona"]
    let hexa = this.zonas[index]["hexaColor"]
    this.secondFormGroup.setValue({
      nombreZona: nombre,
      hexaColor: hexa
    })
    this.editing = true
  }
  GuardarCambiosZona() {
    if (this.EditingIndex > -1) {
      this.zonas[this.EditingIndex] = this.secondFormGroup.value
      this.secondFormGroup.reset()
      this.EditingIndex = -1
      this.editing = false
    }

  }
  NextZonas() {
    if (this.zonas.length > 0) {
      this.stepper?.next()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes añadir al menos una zona',

      })
    }

  }
  seleccionarFila(fila:number){
    if(this.firstFormGroup.value.columnas!=undefined){
      for (let i=0;i<parseInt(this.firstFormGroup.value.columnas);i++){
        this.cambiarEstadoAsiento(fila,i);
      }
    }
    
  }
  seleccionarColumna(columna:number){
    if(this.firstFormGroup.value.filas!=undefined){
      for (let i=0;i<parseInt(this.firstFormGroup.value.filas);i++){
        this.cambiarEstadoAsiento(i,columna);
      }
    }
  }

}
