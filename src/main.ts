import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';
import { Component, enableProdMode, inject, runInInjectionContext } from '@angular/core';
import { AppLoaderService } from '@app/app-loader.service';

if (environment.production) {
    enableProdMode();
}

@Component({
  selector: 'app-component-wrapper',
  template: `<div id="app-root"></div>`,
  standalone: true
})
export class AppComponentWrapper {}

bootstrapApplication(AppComponentWrapper, appConfig).then(appRef => {
    runInInjectionContext(appRef.injector, () => {
        const appLoaderService = inject(AppLoaderService);
        appLoaderService.loadAppComponent();
    });
    console.log('Application bootstrapped successfully');
}).catch(err => {
    console.error('Error bootstrapping application:', err);
});