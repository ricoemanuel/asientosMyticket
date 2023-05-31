import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginserviceService } from 'src/app/services/loginservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = ""
  contrasena = ""
  constructor(private router: Router, private loginservice: LoginserviceService) { }
  async iniciar() {

    let email = this.correo
    let password = this.contrasena
    this.loginservice.login({ email, password }).then(usuario => {
      localStorage.setItem("login", "true")
      localStorage.setItem("user", usuario.user.uid)
      window.location.reload()
    }).catch(e => {
      if (e.code == "auth/invalid-email") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Este email es inválido',

        })
      } else if (e.code == "auth/user-not-found") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Este usuario no existe',

        })
      } else if (e.code == "auth/wrong-password") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La contraseña es incorrecta',

        })
      }
      

    })




  }
}
