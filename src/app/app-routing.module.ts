import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridAsientosComponent} from '../app/components/grid-asientos/grid-asientos.component'
import {RegistrarEventoComponent} from '../app/components/registrar-evento/registrar-evento.component'
import {ListaEventosComponent} from '../app/components/lista-eventos/lista-eventos.component'
import { VistaclienteComponent } from './components/vistacliente/vistacliente.component';
const routes: Routes = [
  { path: 'eventos', component: ListaEventosComponent },
  { path: 'registrar', component: RegistrarEventoComponent },
  { path: 'eventos/:id', component: GridAsientosComponent },
  { path: 'mapa/:id', component: VistaclienteComponent },
  { path: '', redirectTo: '/eventos', pathMatch: 'full' }, // Ruta vacía redirige a '/eventos'
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
