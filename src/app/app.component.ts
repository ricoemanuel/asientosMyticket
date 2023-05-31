import { Component, OnInit } from '@angular/core';
import { LoginserviceService } from './services/loginservice.service';
import { FirebaseFirestoreService } from './services/firebase.firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  logged:boolean|undefined
  constructor(private login:LoginserviceService, private firebase:FirebaseFirestoreService){}
  ngOnInit(): void {
    this.logged=localStorage.getItem("login")=="true"
    this.firebase.getAsientosNull().then((query=>{
      query.forEach(asiento=>{
        let newasiento=asiento.data();
        newasiento["estado"]="libre";
        this.firebase.setAsiento(newasiento);
      })
    }))
  }
}
