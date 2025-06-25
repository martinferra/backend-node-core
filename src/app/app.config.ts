import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { appRoutes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { getAuthHeaderFn } from "./interceptors/header.interceptor";
import { getCatchErrorFn } from "./interceptors/http-error.interceptor";
import { AuthService } from "./shared/services/auth/auth.service";
import { AppLoaderService } from "./app-loader.service";
import { ComponentResolverService } from "src/models/component-resolver.service";
import { CUSTOM_ELEMENTS_SERVICE_TOKEN } from "./custom-elements.interface";
import { DefaultElementsService } from "./default-elements.service";

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
    {
      provide: CUSTOM_ELEMENTS_SERVICE_TOKEN,
      useClass: DefaultElementsService
    },
    AppLoaderService
  ],
};