import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SERVICE_TOKEN, ICustomElementsService } from './custom-elements.interface';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {
  private componentRef!: ComponentRef<any>;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    @Inject(CUSTOM_ELEMENTS_SERVICE_TOKEN) private customElementsService: ICustomElementsService
  ) {}

  loadAppComponent() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) {
      throw new Error('The app-root element was not found in the DOM.');
    }

    this.componentRef = createComponent(
      this.customElementsService.appComponentClass(),
      { environmentInjector: this.environmentInjector }
    );
    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    appRoot.appendChild(domElem);
  }

  unloadAppComponent() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }
  }
}