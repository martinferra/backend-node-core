import { Injectable } from '@angular/core';
import { ICustomElementsService } from './custom-elements.interface';
import { AppComponent } from '@martinferra/frontend-custom';

@Injectable()
export class DefaultElementsService implements ICustomElementsService {
  appComponentClass(): any {
    return AppComponent;
  }
}