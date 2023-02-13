import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  public x: any = []
  public y:any = []
  plotData = 'assets/graphData/train.csv'
  constructor(private http: HttpClient) { 

    

  }

  getData(){
   return this.http.get(this.plotData, {responseType: 'text'})
    
  }
}
