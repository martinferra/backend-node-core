import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from 'src/models/data.service';
import { AsyncTasksService } from 'src/reports/async-tasks.service';
import { CostCenter } from './cost-center.model';

@Injectable({
  providedIn: 'root',
})
export class CostCenterService extends DataService {
  constructor(http: HttpClient, asyncTasksService: AsyncTasksService) {
    super(http, asyncTasksService);
  }

  getModel(): string {
    return 'costcenter';
  }

  getMainEntityClass(): any {
    return CostCenter;
  }

  findAll(): Observable<CostCenter[]> {
    return this.find({});
  }

  findGridData(query?: any): Observable<any> {
    let _query: any = {
      filter: query ?? {},
    };
    return this.find(_query);
  }

  findAutocompleteOptions(queryData: any, discriminator?: string): Observable<any> {
    return this.find(queryData, 'findAutocompleteOptions', discriminator)
  }
}
