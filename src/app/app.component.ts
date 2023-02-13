import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    //this.getBooleans();
    
  }
  
  title = 'iTecUI';
  img: string = 'assets/pia_startseite_en.jpg'
  feature: string = "NOTHING"
  heading: string = "Home Page"
  
  //Booleans to show various components in the display rectangle
  checkFeature: boolean = true;
  treeView: boolean = false;
  checkList: boolean = false;
  anlage: boolean = false;
  infoPage: boolean = false;
  anlageDetial: boolean = false;
  graph: boolean = false;

  

   booleanVariables = {
    checkFeature : false,
    treeView:      false,
    checkList:     false,
    anlage:        false,
    infoPage:      false,
    anlageDetial:  false,
  }

  //variables to display the anlage component and its details
  anlageName: string =  '';
  
  //Start with Übersicht and the PowerBI data in the heading
  //bools:any
  //getBooleans(){
  //  this.bools = booleanVariables;
  //  console.log('Booleans:',this.bools)
  //}

  displayImg(event: string){
    console.log('img',event)
    this.img = event;
  }

  displayFeature(feature: string){
    
    console.log('received feature', feature)
    this.feature = feature

    if(feature === 'Wissensdatenbank'){
      this.treeView = true
      this.checkFeature = false
      this.checkList = false;
      this.anlage = false;
      this.infoPage = false;
      this.anlageDetial = false;
      this.graph = false;
    }
    else if(feature === 'Leitfaden'){
      this.checkList = true;
      this.checkFeature = false
      this.treeView = false
      this.anlage = false
      this.infoPage = false;
      this.anlageDetial = false;
      this.graph = false;
    }
    else if(feature === 'Anlage'){
      this.anlage = true
      this.checkList = false;
      this.checkFeature = false
      this.treeView = false
      this.infoPage = false;
      this.anlageDetial = false;
      this.graph = false;
    }
    else{
      this.checkFeature = true;
      this.checkList = false;
      this.anlage = false
      this.infoPage = false;
      this.anlageDetial = false;
      this.graph = false;
    }
  }

  displayHeading(heading:string){
    console.log(heading)
    this.heading = heading
  }
  
  displayInfo(event: boolean){
    //emiting the boolean directly form the treeview, instead of checking the condition here.
    this.infoPage  = event;
    this.treeView = false;
    this.anlageDetial = false;
    this.graph = false;
    //console.log('event caught',event)
  }

  anlageToDisplay(anlageName:string){
    this.anlageName = anlageName;
    this.anlageDetial = true;
    this.anlage = false
    this.graph = false
    console.log('Anlage name:',this.anlageName)
  }

  displayGraph(event:boolean){
    this.graph = event;
    this.anlageDetial = false;
  }

  // TODO
  //a function to make all other booleans false, instead of doing it individually in each function
 // allOtherComponentsBooleanFalse(variables:any){
 //   for (var prop in this.bools) {
 //     
 //    if(prop == variables){
 //      console.log('Boolean of feature is',this.bools[prop])
//
 //   
 //    }
 //    console.log('Property of boolean obj:',prop)
 //     if (this.bools.hasOwnProperty(prop)) {
 //       this.bools[prop] = true;
 //     }
 //   }
 // }
}

const booleanVariables = {
  checkFeature : false,
  treeView:      false,
  checkList:     false,
  anlage:        false,
  infoPage:      false,
  anlageDetial:  false,
}