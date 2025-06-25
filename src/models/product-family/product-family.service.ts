import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AsyncTasksService } from '../../reports/async-tasks.service';
import { ProductFamily } from './product-family.model';

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyService extends DataService {
  constructor(http: HttpClient, asyncTasksService: AsyncTasksService) {
    super(http, asyncTasksService);
  }

  getModel(): string {
    return 'productfamily';
  }

  getMainEntityClass(): any {
    return ProductFamily;
  }

  findGridData(query?: any): Observable<any> {
    let _query: any = {
      filter: query ?? {},
      populateOpts: [{ path:'costCentersUsage.costCenter' }]
    };
    return this.find(_query);
  }

  findAutocompleteOptions(queryData: any, discriminator?: string): Observable<any> {
    return this.find(queryData, 'findAutocompleteOptions', discriminator)
  }
}
