import { Component, OnInit } from '@angular/core';
import { LoginserviceService } from './services/loginservice.service';
import { FirebaseFirestoreService } from './services/firebase.firestore.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  logged: boolean | undefined;
  currentPath: string | null = null;
  map: boolean | undefined;
  constructor(
    private login: LoginserviceService,
    private firebase: FirebaseFirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url;
        let name=this.currentPath.split('/')[1]
        if (name != "mapa") {
          localStorage.setItem("mapa","false");
          this.logged = localStorage.getItem('login') === 'true';

          this.firebase.getAsientosNull().then(query => {
            query.forEach(asiento => {
              let newasiento = asiento.data();
              newasiento['estado'] = 'libre';
              this.firebase.setAsiento(newasiento);
            });
          });
        }else{
          localStorage.setItem("mapa","true");
          this.map=true;

        }
      }
    });
  }
}
