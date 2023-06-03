import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseFirestoreService } from 'src/app/services/firebase.firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit, AfterViewInit {
  constructor(private route: ActivatedRoute, private _formBuilder: FormBuilder,
    private asientoService: FirebaseFirestoreService,private router: Router) {
  }

  eventoId: string = ""
  firstFormGroup = this._formBuilder.group({
    nombre: ['', Validators.required],
    columnas: ['', Validators.required],
    filas: ['', Validators.required],
  });
  @ViewChild('stepper') stepper: MatStepper | undefined;
  secondFormGroup = this._formBuilder.group({
    nombreZona: '',
    hexaColor: '',
    precioZona: '',
  });

  SelectZonas = new FormGroup({
    zonaSeleccionada: new FormControl('')
  });
  disabled: boolean = true;
  public color: ThemePalette = 'primary';
  public touchUi = false;

  isLinear = false;
  arrayAsientos: any[] = []
  asientoLibre: any[][] = [];
  editing: boolean = false
  zonas: any[] = []
  EditingIndex: number = -1
  evento: any | undefined;
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.eventoId = params['id'];
    });
    this.evento = await this.asientoService.getEvento(this.eventoId);
    this.zonas = this.evento.zonas
    this.firstFormGroup.get("nombre")?.patchValue(this.evento.nombre)
    this.firstFormGroup.get("filas")?.patchValue(this.evento.filas)
    this.firstFormGroup.get("columnas")?.patchValue(this.evento.columnas)

    this.asignar()


  }
  async ngAfterViewInit(): Promise<void> {
    Swal.fire({
      icon: 'info',
      title: 'Atención!',
      text: 'Si deseas realizar cambios en el color, precio y nombre de las zonas, deberás seleccionar nuevamente los palcos o asientos correspondientes. Sin embargo, no te preocupes, una vez guardes los cambios y realices traslados de una zona a otra, los datos de la venta siempre estarán vinculados a ese asiento trasladado. Si necesitas modificar los datos de la venta, puedes hacerlo directamente desde el mapa.',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
    
  }
  async asignar() {
    if (this.firstFormGroup.value.filas != undefined && this.firstFormGroup.value.columnas != undefined) {
      for (let i = 0; i < parseInt(this.firstFormGroup.value.filas); i++) {
        this.asientoLibre[i] = [];
        for (let j = 0; j < parseInt(this.firstFormGroup.value.columnas); j++) {
          this.asientoLibre[i][j] = {
            'cliente': {
              'nombre': 'null',
              'correo': 'null',
              'tipo': 'null',
              'metodo': 'null',
              'dinero': 0
            },
            'columna': j,
            'fila': i,
            'estado': 'libre',
            'vendedor': 'null',
            'evento': this.eventoId,
            'zona': {
              'nombreZona': 'libre',
              'hexaColor': 'white'
            }
          };
        }
      }
    }
    let asientos = await this.asientoService.getAsientosPorEvento(this.eventoId)
    asientos.forEach(asiento => {
      let data: any = asiento.data()
      this.asientoLibre[data.fila][data.columna] = data
    })
    this.evento.filas=this.firstFormGroup.value.filas;
    this.evento.columnas=this.firstFormGroup.value.columnas;
    this.evento.nombre=this.firstFormGroup.value.nombre;

  }
  GuardarCambiosZona() {
    if (this.EditingIndex > -1) {
      this.zonas[this.EditingIndex] = this.secondFormGroup.value
      this.secondFormGroup.reset()
      this.EditingIndex = -1
      this.editing = false
    }

  }
  anadirZona() {
    this.zonas.push(this.secondFormGroup.value)
    this.zonas[this.zonas.length-1].hexaColor=`#${this.zonas[this.zonas.length-1].hexaColor.hex}`
    console.log(this.zonas)
    this.secondFormGroup.reset()
  }
  NextZonas() {
    this.evento.zonas=this.zonas
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
  editarZona(index: number) {
    this.EditingIndex = index
    let nombre = this.zonas[index]["nombreZona"]
    let hexa = this.zonas[index]["hexaColor"]
    let precio = this.zonas[index]['precioZona']
    this.secondFormGroup.setValue({
      nombreZona: nombre,
      hexaColor: hexa,
      precioZona: precio
    })
    this.editing = true
    console.log(this.asientoLibre)
  }
  cambiarEstadoAsiento(fila: number, columna: number) {
    console.log(this.asientoLibre[fila][columna])
    if (this.SelectZonas.value.zonaSeleccionada != undefined) {
      if (this.SelectZonas.value.zonaSeleccionada != '') {
        
        if (this.SelectZonas.value.zonaSeleccionada == 'white') {
          this.asientoLibre[fila][columna]["zona"] = {

            'nombreZona': 'libre',
            'hexaColor': 'white'

          };
          
        } else {
          
          if (this.asientoLibre[fila][columna]["zona"]['nombreZona'] == "libre") {
            
            this.asientoLibre[fila][columna]["zona"] = this.SelectZonas.value.zonaSeleccionada
            
          } else {
            
            this.asientoLibre[fila][columna]["zona"] = {

              'nombreZona': 'libre',
              'hexaColor': 'white'

            };
          }


        }

      }
    }
    console.log(this.asientoLibre)
  }
  seleccionarFila(fila: number) {
    if (this.firstFormGroup.value.columnas != undefined) {
      for (let i = 0; i < parseInt(this.firstFormGroup.value.columnas); i++) {
        this.cambiarEstadoAsiento(fila, i);
      }
    }

  }
  seleccionarColumna(columna: number) {
    if (this.firstFormGroup.value.filas != undefined) {
      for (let i = 0; i < parseInt(this.firstFormGroup.value.filas); i++) {
        this.cambiarEstadoAsiento(i, columna);
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
  async submit() {
    Swal.fire({
      icon: 'info',
      title: 'Atención!',
      text: 'Guardando los cambios',
      showConfirmButton: false,
    });
    this.asientoService.setEvento(this.eventoId,this.evento);
    let asientosRegistrados=0
    this.asientoLibre.forEach(async fila=>{
      fila.forEach(async asiento=>{
        if(asiento.zona.nombreZona!="libre"){
          await this.asientoService.setAsiento(asiento)
        }else{
          await this.asientoService.deleteAsiento(asiento)
        }
        asientosRegistrados++
        if(asientosRegistrados===(this.asientoLibre[0].length-1)*(this.asientoLibre.length-1)){
          Swal.fire({
            icon: 'success',
            title: 'Enhorabuena!',
            text: 'Cambios guardados',
            showConfirmButton: false,
            timer:1500
          }).then(()=>{
            this.router.navigate(['eventos',this.eventoId])
          })
        }
      })
    })
    
  }
}
