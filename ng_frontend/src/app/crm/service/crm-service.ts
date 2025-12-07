import { environment as env } from '@env/environment';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  protected http = inject(HttpClient);
  protected API_URL = `${env.SERVER_BACKEND}/crm`;

}
