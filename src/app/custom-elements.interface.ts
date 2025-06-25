import { InjectionToken } from '@angular/core';

export interface ICustomElementsService {
    appComponentClass(): any;
}

export const CUSTOM_ELEMENTS_SERVICE_TOKEN = new InjectionToken<ICustomElementsService>('custom elements service');