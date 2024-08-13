
  export interface DonutChartData {
    labels: string[];
    datasets: Dataset[];
  }
  
  export interface Dataset {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }
  