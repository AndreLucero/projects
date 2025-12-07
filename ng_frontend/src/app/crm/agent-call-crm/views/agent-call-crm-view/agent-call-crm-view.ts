import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { CrmAgentCallService } from '../../service/crm-agent-call-service';
import { Carousel } from '../../components/carousel/carousel';
import { CarouselSkeleton } from '../../components/carousel-skeleton/carousel-skeleton';

import { dateFormat } from '@lib/utils';

import type { CrmRow, FinGestion } from '../../agent_call';
import type { Uuid } from '@lib/definitions';
import { DataviewFingestion } from "../../components/dataview-fingestion/dataview-fingestion";
import { AsyncPipe } from '@angular/common';


interface ClientInformation {
  nombre?: string,
  apPaterno?: string,
  apMaterno?: string,
  telAdicional?: string,
  quienContacto?: string,

  factura?: string,
  fechaCompra?: Date|string,
  modelo?: string,
  imei?: string
}

@Component({
  selector: 'agent-call-crm-view',
  imports: [
    FieldsetModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    TabsModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    Toast,
    Carousel,
    CarouselSkeleton,
    DataviewFingestion,
    AsyncPipe
],
  templateUrl: './agent-call-crm-view.html',
  styles: `
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,
  providers: [ MessageService ]
})
export class AgentCallCrmView implements OnInit {

  readonly id_audio:Uuid|null;
  readonly userId:Uuid|null;
  readonly nombre_empleado:string|null;
  readonly telefono:string|null;
  readonly participantId:Uuid|null;
  private readonly fechahorainicio = dateFormat(new Date(), 'Y-m-d H:i:s');

  formulario = new FormGroup({
    fingestion: new FormControl('', [Validators.required]),
    subfingestion: new FormControl('', [Validators.required]),
    comentario: new FormControl('')
  });
  arrSubfingestion:string[] = [];
  clientInformation:ClientInformation = {};

  tabValue = 0;
  tabsOptions = ['Asesoría', 'Quejas', 'SyG Tienda', 'Otros'];

  modelosCelulares:string[] = [];
  
  private allFines:FinGestion[] = [];
  intentoEnviar = false;
  formDisable = false;

  constructor(
    public crmAgentCallService:CrmAgentCallService,
    private messageService:MessageService,
    private route:ActivatedRoute
  ){

    this.id_audio = (this.route.snapshot.queryParamMap.get('id_llamada') as Uuid);
    this.participantId = (this.route.snapshot.queryParamMap.get('participantId') as Uuid);
    this.nombre_empleado = this.route.snapshot.queryParamMap.get('agentname') ?? '';
    this.userId = ( this.route.snapshot.queryParamMap.get('numempleado') as Uuid ) ?? '';

    const tel = this.route.snapshot.queryParamMap.get('answernumber') ?? '';
    this.telefono = tel.replace(/[^0-9]/g, '');

    this.setRealNumempleado( this.userId );
  }

  ngOnInit(): void {
    this.setFinesGestion();
    this.setModelosCelulares();

    this.formulario.get('fingestion')?.valueChanges.subscribe(newFingestion =>{
      if( !newFingestion ) return;
      this.arrSubfingestion = this.replaceOptByAllModels( newFingestion, 'Equipos celulares (todos los modelos)');
    });

  }

  get tipo_fingestion(){
    return this.tabsOptions[ this.tabValue ];
  }

  insertPrerecord(numempleado:string){

    if( !this.id_audio ||
        !this.telefono
    ) return this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Ocurrió un problema al cargar la llamada'});

    this.crmAgentCallService.insertPrerecord({
      id_llamada: (this.id_audio as Uuid),
      fecha_llamadainicio: this.fechahorainicio,
      numero_empleado: numempleado,
      telefono: this.telefono
    }).subscribe(data => {
      if( !data.status ) this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Ocurrió un problema al cargar la llamada'});
    });

  }

  setFinesGestion(){
    this.crmAgentCallService.getAllFines().subscribe(data => {
      if( !data.status ) return console.log(data.message);
      this.tabsOptions = [... new Set( data.result.map(e => e.tipo_fingestion) )];
      this.allFines = data.result;
    });
  }

  setModelosCelulares(){
    this.crmAgentCallService.getAllCelulares().subscribe(data => {
      if( !data.status ) return console.log(data.message);
      this.modelosCelulares = data.result.map(e => e.modelo);
    });
  }

  getFingestion(){
    const set = new Set( this.allFines.filter( e => e.tipo_fingestion == this.tipo_fingestion).map(e => e.fingestion) );
    return Array.from( set.values() );
  }

  getSubfingestion(fingestion:string){
    const set = new Set( this.allFines.filter( e => e.tipo_fingestion == this.tipo_fingestion && e.fingestion == fingestion).map(e => e.subfingestion) );
    return Array.from( set.values() );
  }

  replaceOptByAllModels(newFingestion:string, text:string){
    let newArrOpts = this.getSubfingestion( newFingestion );
      
    const index = newArrOpts.findIndex(e => e === text);
    if( index > -1 ){
      newArrOpts.splice(index, 1);
      newArrOpts = [ ... newArrOpts, ... this.modelosCelulares ];
    }

    return newArrOpts;
  }

  resetForm(){
    this.intentoEnviar = false;
    this.arrSubfingestion = [];
    this.formulario.reset();
  }

  validateForm(){
    const { fingestion, subfingestion, comentario } = this.formulario.value;

    if(
        this.formulario.invalid || 
        !this.clientInformation.quienContacto ||
        !fingestion ||
        !subfingestion

      ){
      this.intentoEnviar = true;
      return this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Es necesarió llenar todos los campos requeridos'});
    }

    const data:CrmRow = {
      id_llamada: (this.id_audio as Uuid),
      fecha_llamadainicio: this.fechahorainicio,
      fecha_llamadafin: dateFormat(new Date(), 'Y-m-d H:i:s'),
      numero_empleado: this.crmAgentCallService.numempleado,
      nombre_empleado: this.nombre_empleado,
      nombre_cliente: this.clientInformation.nombre,
      apellidopaterno_cliente: this.clientInformation.apPaterno,
      apellidomaterno_cliente: this.clientInformation.apMaterno,
      telefono: this.telefono,
      telefonoadicional: this.clientInformation.telAdicional ? this.clientInformation.telAdicional.replace(/[^0-9]/g,'') : undefined,
      numero_factura: this.clientInformation.factura,
      fecha_compra: this.clientInformation.fechaCompra ? dateFormat(new Date( this.clientInformation.fechaCompra ), 'Y-m-d') : undefined,
      imei_equipo: this.clientInformation.imei,
      id_contacto: this.clientInformation.quienContacto,
      comentario: comentario ?? undefined,
      categoria: this.tipo_fingestion,
      fingestion: fingestion,
      subfingestion: subfingestion,
    };

    this.saveCall( data );
  }

  setRealNumempleado( userId:Uuid|null ){
    if( !userId ) return this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Ocurrió un problema al obtener la información del usuario'});

    this.crmAgentCallService.getUser( userId ).subscribe(data => {
      if( !data.status ) return this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Ocurrió un problema al obtener la información del usuario'});
      
      this.insertPrerecord( data.result.numempleado );
    })

  }

  private saveCall(data: CrmRow){
    this.formDisable = true;

    this.crmAgentCallService.updatePrerecord(data).subscribe(resp => {
      if( resp.status ) return this.finishCall();
      console.log({data})
      this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Es necesarió llenar todos los campos requeridos'});
      this.formDisable = false;
    });

  }

  private finishCall(){
    if( !this.id_audio || !this.participantId ) return this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Ocurrió un problema mientras se colgaba la llamada'});

    this.crmAgentCallService.finishCall({conversationId: this.id_audio, participantId: this.participantId}).subscribe(data => {
      if( !data.status ) this.messageService.add({key:'AgentCallCrmViewToast', severity: 'error', summary: 'Ocurrió un problema al colgar la llamada'});
    });
  }

}