import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  img: string = 'nothing'
  feature: string = "NOTHING"
  heading: string = "Startseite"

  product : boolean = false
  prozess : boolean = false
  Auswertung : boolean = false
  Leitfaden : boolean = false

  @Output() displayImg = new EventEmitter<string>();
  @Output() displayFeature = new EventEmitter<string>();
  @Output() displayHeading = new EventEmitter<string>();

  onClicked(feature: string){
    //can call a function here and pass feature argument to it and shift all this logic to a service.
    this.feature = feature
    this.displayFeature.emit(feature)


    if (feature === "Anlage") {
      this.product     = true
      this.prozess     = false
      this.Auswertung  = false
      this.Leitfaden   = false
      this.heading = "Plant"
      this.img = "assets/Produkt.PNG"
      //this.displayImg.emit(this.img)
      this.displayHeading.emit(this.heading)
    }
    else if (feature === "Wissensdatenbank") {
      this.product     = false
      this.prozess     = true
      this.Auswertung  = false
      this.Leitfaden   = false
      this.heading = 'Knowledge Base'
      this.displayHeading.emit(this.heading)
      
    } 
    else if (feature === "Leitfaden") {
      //can use nfIf here to display something else in the DOM like a tree view
      this.product     = false
      this.prozess     = false
      this.Auswertung  = false
      this.Leitfaden   = true
      this.heading = "Checklist"
      this.img = "assets/Leitfaden.PNG"
      this.displayImg.emit(this.img)
      this.displayHeading.emit(this.heading)
    }
    else if (feature === "Auswertung") {
      this.product     = false
      this.prozess     = false
      this.Auswertung  = true
      this.Leitfaden   = false
      this.heading = "Data Analysis"
      this.img = "assets/pia_startseite_en.jpg"
      this.displayImg.emit(this.img)
      this.displayHeading.emit(this.heading)
    }  
    else if (feature === "menu") {
      this.product     = false
      this.prozess     = false
      this.Auswertung  = false
      this.Leitfaden   = false
      this.heading = "Home Page"
      this.img = "assets/pia_startseite_en.jpg"
      this.displayImg.emit(this.img)
      this.displayHeading.emit(this.heading)

      }
    else {
      
    }{
      
    }
    
    
  }
  goToLink(url: string){
    window.open(url, "_blank");
  }
}
