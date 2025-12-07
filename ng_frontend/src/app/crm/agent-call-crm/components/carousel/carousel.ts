import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CarouselModule } from 'primeng/carousel';
import { CrmAgentCallService } from '../../service/crm-agent-call-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'carousel',
  imports: [ CarouselModule, CommonModule ],
  templateUrl: './carousel.html',
  styles: ``
})
export class Carousel implements OnInit, OnChanges{

  @Input({required:true}) numempleado!:string|null;

  kpi_indicators:{ name:string, value:string, decimal?:string }[] = []

  constructor(
    public crmAgentCallService:CrmAgentCallService
  ){}

  ngOnInit(): void {
    this.getKpi();
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  getColor( kpi:string, value:number ){

    const enum Colors {
      RED = 'rose',
      YELLOW = 'amber',
      GREEN ='green',
      DEFAULT = 'gray'
    };

    if( kpi === 'nps' ){
      if( value > 90 ) return Colors.GREEN;
      if( value > 80 ) return Colors.YELLOW
      return Colors.RED;
    }

    if( kpi === 'tcr'){
      if( value > 90 ) return Colors.GREEN;
      if( value > 80 ) return Colors.YELLOW
      return Colors.RED;
    }

    if( kpi === 'amabilidad'){
      if( value > 90 ) return Colors.GREEN;
      if( value > 80 ) return Colors.YELLOW
      return Colors.RED;
    }

    return Colors.DEFAULT;
  }

  private getKpi(){
    if( !this.numempleado ) return;
    
    this.crmAgentCallService.getUserKpiIndicators( this.numempleado ).subscribe(data => {
      if( !data.status ) return console.error(data.message);

      const {tcr, nps, amabilidad, total_encuestas } = data.result;

      const [intTcr, decTcr] = tcr.split('.');
      const [intNps, decNps] = nps.split('.');
      const [intAmab, decAmab] = amabilidad.split('.');

      this.kpi_indicators = [
        {name: 'tcr', value: intTcr, decimal: decTcr },
        {name: 'nps', value: intNps, decimal: decNps },
        {name: 'amabilidad', value: intAmab, decimal: decAmab },
        {name: 'total encuestas', value: total_encuestas },
      ]
      
    })
  }

}
