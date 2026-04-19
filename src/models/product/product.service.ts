import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AsyncTasksService } from '../../reports/async-tasks.service';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends DataService {
  constructor(http: HttpClient, asyncTasksService: AsyncTasksService) {
    super(http, asyncTasksService);
  }

  getModel(): string {
    return 'product';
  }

  getMainEntityClass(): any {
    return Product;
  }

  findGridData(query?: any): Observable<any> {
    let _query: any = {
      filter: query ?? {},
      populateOpts: [
        { path:'productFamily' },
        { path: 'inputs' }
      ]
    };
    return this.find(_query);
  }

  findAutocompleteOptions(queryData: any, discriminator?: string): Observable<any> {
    return this.find(queryData, 'findAutocompleteOptions', discriminator)
  }
}
