import { Component, OnInit} from '@angular/core';
import { Chart } from 'node_modules/chart.js';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
 
  xLabels:any = [];
  BarChartData:any = [];
  LineChartData:any = [];
  yData:any = [];
  arr:any = []
  showGraph:boolean = false;


  constructor() { 
  }

  ngOnInit(): void {
    //this.barChart()
    //this.lineChart()
  }
  
  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
          let csv: any = reader.result
          console.log('csv',csv)
          const table = csv.split('\n')

          table.forEach((row: string) => {
            const columns = row.split(',')
            console.log('element', columns)
            const yData = columns
            this.yData.push(yData)
          });
          this.showGraph = true
          this.barChart()
         
         }
    }
}
 
         
  /**
   * Format for CSV
   * First row should be integers for x axis labels
   * 2nd row is the data to plot
   * Please keep in mind that if you have powers of 10 in data then excel puts E-10 something like this 
   * in your csv, This will be read as E and not a number in the getData() function.
   * This will cause problem in the plot. First refactor the format of cells in Excel so that it stores the
   * numbers as pure decimals(foat) without the powers of 10. 
   */
  async getData(){
    const response = await fetch('assets/graphData/GraphData.csv')
    const data = await response.text();
    //console.log('fetch data',data)
    const table = data.split('\n')
    console.log('Rows', table)

    table.forEach(row => {
      const columns = row.split(',')
      console.log('element', columns)
      const yData = columns
      this.yData.push(yData)
    });

  };

  lineChart(){
  
    //await this.getData();
    const myChart = new Chart('lineChart' , {
      type: 'line',
      data: {
        labels: this.yData[0],
        datasets: [{
        label: 'Concentration',
        data: this.yData[1],
        //fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
  }]
      }
    }
    )
  }
  barChart(){
    
   // await this.getData();
    const myChart = new Chart('myChart', {
      type: 'bar',
      data: {
          labels: this.yData[0],
          datasets: [{
              label: 'Concentration',
              data: this.yData[1],
              backgroundColor: [
                  'rgba(0, 230, 230, 0.8)',
              ],
              borderColor: [
                  'rgba(0, 230, 230, 0.8)',
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
 
}
