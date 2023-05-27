import { ChangeDetectorRef, Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-menu-vertical',
  templateUrl: './menu-vertical.component.html',
  styleUrls: ['./menu-vertical.component.css']
})
export class MenuVerticalComponent implements OnInit{
  isMenuOpen: boolean | undefined;
  active=1
  mobileQuery: MediaQueryList;
  shouldRun = true;
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.simularClickEnBoton()
    if (window.innerWidth < 768) {  // Verifica si el ancho de la pantalla es menor a 768px (tamaño de un tablet)
      this.isMenuOpen = false;
    } else {
      this.isMenuOpen = true;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @ViewChild('menu') menuButton: ElementRef | undefined;
  
  simularClickEnBoton() {
    if(this.menuButton!=undefined){
      this.menuButton.nativeElement.click();
    }
    
  }
}
