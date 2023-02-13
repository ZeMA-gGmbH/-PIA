import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

  @Output() displayInfo = new EventEmitter<boolean>();

  showAnpressen: boolean = false;
  showSchrauben: boolean = false;
  werkzeug: boolean = false;
  montage: boolean = false;
  lesosnLearned : boolean = false;
  
  showFugen: boolean = false;
  showhandhaben: boolean = false;
  showSondernoperation : boolean = false;
  showInbetrieb: boolean = false;
  showHilfsprozesse: boolean = false;
  heading: string = ''
  lessonInfo:any = []

  constructor() { }

  ngOnInit(): void {
  }

  onClickFugen(){
    this.showFugen = !this.showFugen
      //just to close the other drop downs when the parent node is clicked.
    if (this.showAnpressen = true) {
      this.showAnpressen = false
    }
    if (this.showSchrauben = true) {
      this.showSchrauben = false
      
    }
  }
  onClickHandhaben(){
    this.showhandhaben = !this.showhandhaben
   
  }
  onClickSonderoperationen(){
    this.showSondernoperation =!this.showSondernoperation
  }

  onClickInbetriebnahme(){
    this.showInbetrieb =!this.showInbetrieb
  }

  onClickHilfsprozesse(){
    this.showHilfsprozesse =!this.showHilfsprozesse
  }
  onClickAnpressen(){
    this.showAnpressen = !this.showAnpressen;
    if (this.showSchrauben = true) {
      this.showSchrauben = false
      
    }
  }

  onClickSchrauben(){
    this.showSchrauben = !this.showSchrauben
  }

  onClickWerkzeug(){
    this.werkzeug = !this.werkzeug
  }
  
  info: boolean = false;
 // emits data when the node is clicked, event can be catched somewhere else to display the infoPage
  showInfo(data: string){
   
    this.info = true;
    this.displayInfo.emit(this.info)
    //console.log("Show info clicked")
  }

  openTreeview(){
    this.montage = true;
    this.lesosnLearned = false;
  }

  openLesson(){
    this.lesosnLearned = true;
    this.montage = false;
    

  }

  searchNodeInfo(nodeData: string, data: any){
    var filteredData:any = []
    var nodeID:string = nodeData
    nodeData = nodeData.toLowerCase();
    console.log('json length is:',data.length)
    for(var i=0; i < data.length; i++){
      var id = data[i].id.toLowerCase()
      if (id === nodeData){
        filteredData.push(data[i])
        //console.log('collected data is:',filteredData)
      }
    }
    return [filteredData , nodeID]
  }
  lessoninfo: string =''
  onclick(nodeData: string){
    try {
      [this.lessonInfo , this.heading]  =  this.searchNodeInfo(nodeData, LESSONS)
      //console.log(this.lessonInfo.lesson)
      this.lessoninfo = this.lessonInfo[0].lesson
      console.log(this.lessonInfo[0].lesson)
    } catch (error) {
      
    }
  }
}

const LESSONS = [
  {
    'id':'Preparation and project planning',
    'lesson':'any info 1 '
  },
  {
    'id':'Measurement and data planning',
    'lesson':' any info 2 '
  },
  {
    'id':'Data acquisition',
    'lesson':' any info 3'
  },
  {
    'id':'Data check and data cleansing',
    'lesson':' any info 4'
  },
  {
    'id':'Data evaluation and modeling',
    'lesson':' any info 5 '
  },
  {
    'id':'Project completion',
    'lesson':' any info 6'
  }
]