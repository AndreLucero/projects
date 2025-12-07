import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CrmAgentCallService } from '../../service/crm-agent-call-service';

@Component({
  selector: 'dataview-fingestion',
  imports: [],
  templateUrl: './dataview-fingestion.html',
  styles: ``
})
export class DataviewFingestion implements OnInit, OnChanges {
  @Input({required: true}) numempleado!:string;

  countFinesGestion = [
    {name: 'ASESORIA', value: 0},
    {name: 'QUEJAS', value: 0},
    {name: 'SYG TIENDA', value: 0},
    {name: 'OTROS', value: 0},
  ];

  constructor(
    private crmAgentCallService:CrmAgentCallService
  ){}

  ngOnInit(): void {
    this.setFinesGestionCount()
  }

  ngOnChanges(changes: SimpleChanges): void {}

  setFinesGestionCount(){
    this.crmAgentCallService.getUserKpiFingestion(this.numempleado).subscribe(data => {
      if( !data.status ) return console.log(data.message);

      const { asesoria, quejas, syg_tienda, otros } = data.result;
      this.countFinesGestion = [
        {name: 'ASESORIA', value: asesoria},
        {name: 'QUEJAS', value: quejas},
        {name: 'SYG TIENDA', value: syg_tienda},
        {name: 'OTROS', value: otros},
      ];

    })
  }

}
