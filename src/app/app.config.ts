import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { appRoutes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { getAuthHeaderFn } from "@app/interceptors/header.interceptor";
import { getCatchErrorFn } from "@app/interceptors/http-error.interceptor";
import { AuthService } from "@app/shared/services/auth/auth.service";
import { AppLoaderService } from "./app-loader.service";
import { ComponentResolverService } from "@martinferra/frontend-common/models/component-resolver.service";
import { getProjectCustomElementsProviders } from "./project-custom-elements.providers";

function appInitializerFactory(authService: AuthService) {
  return () => {
    return authService.checkTheUserOnTheFirstLoad();
  };
}

const httpInterceptors = [
  getAuthHeaderFn(),
  getCatchErrorFn(),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors(httpInterceptors)),
    provideAnimations(),
    ComponentResolverService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AuthService],
    },
    ...getProjectCustomElementsProviders(),
    AppLoaderService
  ],
};