import { Component, EventEmitter, OnInit, Output } from '@angular/core';



@Component({
  selector: 'app-anlage',
  templateUrl: './anlage.component.html',
  styleUrls: ['./anlage.component.scss']
})
export class AnlageComponent implements OnInit {

  @Output() displayAnlageDetail = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }
  showPlant: boolean = false;
  anlageName: string = ''
  plantImg: string = ''
  
  onClicked(anlageName: string) {
    this.anlageName = anlageName;
    this.loadPlantImg(anlageName)
    this.showPlant = true;  
    console.log('Anlage name received',this.anlageName); 
  }

  loadPlantImg(anlageName: string){
    if(anlageName == "WaMO"){
      this.plantImg = "assets/Anlage_frontal.jpg"
    }
    else if(anlageName == "Ball_Bearing"){
      this.plantImg = "assets/kugellager_render-495x400.jpg"
    }
    else{
      this.plantImg = ""
    }
  }

  onOpenPlant(){
   
    this.displayAnlageDetail.emit(this.anlageName);
  }


  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  
}

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}



