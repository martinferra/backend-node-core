import { Provider } from '@angular/core';
import { CUSTOM_ELEMENTS_SERVICE_TOKEN } from './custom-elements.interface';
import { DefaultElementsService } from './default-elements.service';

type RuntimeCustomProvidersFactory = () => Provider[];

function getDefaultProviders(): Provider[] {
  return [
    {
      provide: CUSTOM_ELEMENTS_SERVICE_TOKEN,
      useClass: DefaultElementsService,
    },
  ];
}

export function getProjectCustomElementsProviders(): Provider[] {
  const runtimeFactory = (
    globalThis as typeof globalThis & {
      __martinferraProjectCustomElementsProviders__?: RuntimeCustomProvidersFactory;
    }
  ).__martinferraProjectCustomElementsProviders__;

  if (typeof runtimeFactory === 'function') {
    try {
      return runtimeFactory();
    } catch (error) {
      console.warn('Custom frontend providers could not be initialized.', error);
    }
  }

  return getDefaultProviders();
}
