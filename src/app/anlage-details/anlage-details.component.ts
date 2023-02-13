import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-anlage-details',
  templateUrl: './anlage-details.component.html',
  styleUrls: ['./anlage-details.component.scss']
})
export class AnlageDetailsComponent implements OnInit {

  @Output() displayInfo = new EventEmitter<boolean>();
  @Output() displayGraph = new EventEmitter<boolean>();
  @Input() anlageName: string;

  showAllProcessList: boolean = false;
  showProcess: boolean = false;
  processName: string = '';
  processImage: string = '';
  processID: any
  showBetriebsmittelBoolean: boolean = false;
  showBetriebsmittleDetail: boolean = false;
  playVideo: boolean = false;
  showProcessImage: boolean = true;
  showWissendatenbank = false;
  showProductList: boolean = false;
  productName: string = '';
  productImg:string = '';
  showProducDetails: boolean = false;
  showSensorList: boolean = false;
  showGraph = false;
  BetriebsmittleName: string = '';
  safeSrc: SafeResourceUrl;
  

  constructor( private sanitizer: DomSanitizer) { 
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/bsaPKSKVpJ0");
  }

  ngOnInit(): void {
    this.showAllProcessList = true;
    this.getStationInfo(this.anlageName);
   
  }
  betriebsmittle:any = []
  produkte:any = []
  linkToPDF: string = ''

  showVideo(){
    this.playVideo = true;
    this.showProcessImage = false;
  }

  

  onStationSelect(selectedProcess: any){
    this.processName = selectedProcess;
    console.log('selectedProcess', selectedProcess)
    this.showProcess =true;
    this,this.showAllProcessList = false;
    this.showBetriebsmittleDetail = false;
    this.Stations.forEach((element: { process: any; img: string; id: any; Betriebsmittel: any; Produkte: any; }) => {
      if(element.process == selectedProcess){
        this.processImage = element.img;
        this.processID = element.id;
        this.betriebsmittle = element.Betriebsmittel;
        this.produkte = element.Produkte;
         }
    });
  }

  goBackToProcessList(){
    this.showBetriebsmittelBoolean = false;
    this.showSensorList = false;
    this.showProducDetails = false;
    this.showProcessImage = true;
    this.playVideo = false;
    this.showAllProcessList = true;
    this.showProcess = false;
    this.showBetriebsmittleDetail = false;
    this.showProductList = false
  }

  goBackToStation(){
    this.showProcess = true
    this.showBetriebsmittelBoolean = false
    this.showProducDetails = false
    this.showSensorList = false
    this.showProductList = false
  }

  goBackToBetriebsmittle(){
    this.showBetriebsmittelBoolean = true
    this.showBetriebsmittleDetail = false
  }

  showProduct(){
    this.showProductList = true;
    this.showBetriebsmittelBoolean = false;
    this.showProcess =false;
    this.showAllProcessList = false;
    this.showBetriebsmittleDetail = false;
  }

  onProduktSelect(produktname: any, img: string){
    this.productName = produktname
    this.productImg = img
    this.showProducDetails = true;
    this.showProductList = false;
    this.showBetriebsmittelBoolean = false;
    this.showProcess =false;
    this.showAllProcessList = false;
    this.showBetriebsmittleDetail = false;
  }

  goBackToProduktList(){
    this.showProducDetails = false
    this.showProductList = true
  }

  showSensor(){
    this.showSensorList = true;
    this.showProducDetails = false;
    this.showBetriebsmittelBoolean = false;
    this.showProcess =false;
    this.showAllProcessList = false;
    this.showBetriebsmittleDetail = false;
  }

  showBetriebsmittel(){
    this.showBetriebsmittelBoolean = true;
    this.showProcess =false;
    this.showAllProcessList = false;
    this.showBetriebsmittleDetail = false;
  }
  
  technicalData:string = ''
  Anleitung:string = ''
  TechnicalZeichnung:string = ''
  betriebImg:string = '';

  onBetriebsmittleSelect(betriebName:string ,technicalData:string , Anleitung:string, TechnicalZeichnung:string,img:string ){
    this.showBetriebsmittleDetail = true;
    this.showBetriebsmittelBoolean = false;
    this.showProcess =false;
    this.showAllProcessList = false;
    this.showSensorList = false;
    this.BetriebsmittleName = betriebName;
    this.technicalData = technicalData;
    this.Anleitung = Anleitung;
    this.TechnicalZeichnung = TechnicalZeichnung;
    this.betriebImg = img;
    console.log('pdf:', this.linkToPDF);
  }

  openWissendatenbank(){
    this.showWissendatenbank = true;
    this.displayInfo.emit(this.showWissendatenbank)
  }

  openGraph(){
    this.showGraph = true;
    this.displayGraph.emit(this.showGraph)
  }


 /** getStationInfo() 
  * this funciton will query the appropriate JSON for displayig your station info
  * Please add an else statement when more stations are added and just set this.Stations = "your JSON name"
  * Remaining code has been adapted to the changes.
  * 
  * NOTE: If you change the structure of the JSON while adding new process, then the code might not
  *       display these changes as there are no HTML elements for the same.
  *       In this case, add appropriate HTML
  */

  Stations: any = []
   getStationInfo(anlageName:string){
    if(anlageName == 'WaMO'){

      this.Stations = wamoStations;
    }
    else if(anlageName == 'Ball_Bearing'){
      
    }

    else(anlageName == '')

   }

   

   //method to get data from the map

      

   
}
/** 
* NOTE: when adding a source to any file from the assets folder, add it With respect to assets folder
        Eg:assets/DataSheets....
        If you add with respect to src folder then wont work
        Eg this wont work:  src/assets/DataSheets....
*/
const wamoStations = [
  {
    id: '1',
    title: 'Assembly Line 1',
    img: "assets/AnlageImg/Station_1.png",
    process: 'Gripping Process',
    Betriebsmittel:[
      {id: '1',
      name: 'Robot​',
      technicalName: 'process 1 tech name',
      img:"assets/AnlageImg/robot.png",
      technicalData:"assets/DataSheets/Technical_Data_of_Robot_XY.pdf",
      Anleitung:"assets/DataSheets/Manual_of_Robot_XY.pdf",
      TechnicalZeichnung:"assets/DataSheets/Technical_Drawing_Robot_XY.pdf"
    },
    {id: '2',
      name: 'Gripper',
      technicalName: 'process 2 tech name',
      img:"assets/AnlageImg/gripper.png",
      technicalData:"assets/DataSheets/Technical_Data_of_Robot_XY.pdf",
      Anleitung:"assets/DataSheets/Manual_of_Robot_XY.pdf",
      TechnicalZeichnung:"assets/DataSheets/Technical_Drawing_Robot_XY.pdf"
    },
    {id: '3',
      name: 'Resource XYZ​',
      technicalName: 'process 3 tech name',
      img:"assets/AnlageImg/generic_ressource.png",
      technicalData:"",
      Anleitung:"",
      TechnicalZeichnung:""
    },
    ],
    Produkte:[
      {
        variantID:'Variant A',
        name:'Quick Mount',
        img:"assets/AnlageImg/Generic_image.png"
      },
      {
        variantID:'Variant B',
        name:'Profile Holder',
        img:"assets/AnlageImg/Generic_image.png"
      }
    ]
  },

  {
    id: '2',
    title: 'Assembly Line 2',
    img: "assets/AnlageImg/Station_2.png",
    process: 'Bolting process',
    Betriebsmittel:[
      {id: '1',
      name: 'Screw Driver',
      technicalName: 'Tensor ETV STB34-30-10-W',
      img:"assets/AnlageImg/generic_ressource.png",
      technicalData:"assets/DataSheets/Technische_Daten.png",
      Anleitung:"assets/DataSheets/Manual.pdf",
      TechnicalZeichnung:"assets/DataSheets/Technische_Zeichnung_etv_stb34-30-10-bd-w_01.pdf"
    },
   
    ],
    Produkte:[
      {
        variantID:'Variant A',
        name:'Quick Mount',
        img:"assets/AnlageImg/Generic_image.png"
      },
      {
        variantID:'Variant B',
        name:'Profile Holder',
        img:"assets/AnlageImg/Generic_image.png"
      }
    ]
  }
]
  
