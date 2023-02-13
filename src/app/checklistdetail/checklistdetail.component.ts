import { Component, OnInit } from '@angular/core';

/**
   * JSON containing information about the checklist cmponents
   * Structure: Name of the node(Please try to put the name exaxctly as in the Json above to build the treeview TREE_DATA)
   *            Info, hinweise,Tip
   * any of the respective fields might be empty.
   * 
   *   blueprint:
   *      {'id':'', details:{
                        'info': '',
                        'hinweis': '',
                        'tipp':''
          }}
   */

          const NODE_DATA =[
            {'id':'Vorbereitung', 
              'info': 'INFO Vorbereitung',
              'hinweis': 'HINWEIS Vorbereitung',
              'tipp':'TIPP Vorbereitung'
            },
          
            {'id':'Mess und Datenplanung', 
              'info': 'INFO Mess und Datenplanung',
              'hinweis': 'HINWEIS Mess und Datenplanung',
              'tipp':'TIPP Mess und Datenplanung'
            },
          ]

@Component({
  selector: 'app-checklistdetail',
  templateUrl: './checklistdetail.component.html',
  styleUrls: ['./checklistdetail.component.scss']
})
export class ChecklistdetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  nodeData:any =[]

  searchNodeInfo(nodeData: string, data: any){
    var filteredData:any = []

    nodeData = nodeData.toLowerCase();
    for(var i=0; i < data.length; i++){
      var id = data[i].id.toLowerCase()
      if (id === nodeData){
        filteredData.push(data[i])
        //console.log('collected data is:',filteredData)
      }
    }
    return filteredData
  }

  //this.nodeData =  this.searchNodeInfo(data, NODE_DATA)
   //try {
    //console.log(this.nodeData[0].id)
    //}
    //catch(e){
    //need to implement try catch to avoid exception of any node info not added, then the app shouldnt give an error in concole.
   // }


}
