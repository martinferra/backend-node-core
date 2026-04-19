import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AsyncTasksService } from '../../reports/async-tasks.service';
import { Input } from './input.model';

@Injectable({
  providedIn: 'root',
})
export class InputService extends DataService {
  constructor(http: HttpClient, asyncTasksService: AsyncTasksService) {
    super(http, asyncTasksService);
  }

  getModel(): string {
    return 'input';
  }

  getMainEntityClass(): any {
    return Input;
  }

  findGridData(query?: any): Observable<any> {
    return this.find({
      filter: query ?? {},
    });
  }

  findAutocompleteOptions(queryData: any, discriminator?: string): Observable<any> {
    return this.find(queryData, 'findAutocompleteOptions', discriminator)
  }
}
