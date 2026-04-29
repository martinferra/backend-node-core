import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Type, ViewChild } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { map, merge, mergeWith, Observable, shareReplay, startWith, Subject, Subscription, tap } from 'rxjs';
import { BackgroundTasksService } from '@app/services/backgroundTasks/background-tasks.service';
import { TaskState } from '@martinferra/frontend-common/models/interfaces/taskState.interface';

import { User } from '@martinferra/frontend-common/models/user/user.model';
import { AuthService } from '@app/shared/services';
import { DynamicContainerDirective } from '@app/dynamic-container/dynamic-container.directive';
import { DownloadsListComponent } from '@app/downloads-list/downloads-list.component';
import { UserListComponent } from '@app/users/user-list/user-list.component';
import { RegistrationReqListComponent } from './registration-req/registration-req-list/registration-req-list.component';
import { FloatingComponent, FloatingComponentConstructor } from '@app/floating-component';
import { ProductFamilyListComponent } from '@martinferra/frontend-custom/product-family/product-family-list/product-family-list.component';
import { CostCenterListComponent } from '@martinferra/frontend-custom/cost-center/cost-center-list/cost-center-list.component';
import { CostCenterUsageNewEditComponent } from '@martinferra/frontend-custom/product-family/cost-center-usage/cost-center-usage-new-edit/cost-center-usage-new-edit.component';
import { ProductListComponent } from '@martinferra/frontend-custom/product/product-list/product-list.component';
import { InputListComponent } from '@martinferra/frontend-custom/input/input-list/input-list.component';

enum MenuItems {
  downloads = 2,
  families = 3
}

type AppMode = 'admin' | 'settings' | 'app';

const dynamicLoadableComponents: Array<any> = [
  CostCenterUsageNewEditComponent
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDividerModule,
    MatListModule,
    DynamicContainerDirective
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedIndex: number = -1;

  user$: Observable<User | null> = merge(
    this.authService.me(),
    this.authService.getUser()
  ).pipe(
    tap((user: User | null) => {
      if (!user) {
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        });
      }
    }),
    shareReplay(1)
  );

  userIsAdmin$: Observable<boolean> = this.user$.pipe(
    map((user: User | null) => !!user?.isAdmin)
  );

  appMode: AppMode = 'app';

  _appMode$: Subject<AppMode> = new Subject<AppMode>();

  appMode$: Observable<AppMode> = this.userIsAdmin$.pipe(
    map((isAdmin: boolean) => (isAdmin ? 'admin' : 'app')),
    mergeWith(this._appMode$),
    tap((am: AppMode) => {
      this.appMode = am;
      if (am === 'admin') {
        setTimeout(() => this.showRegistrationReqsList());
      }
    })
  );

  setAdminMode(): void {
    if (this.setAppMode('admin')) {
      this.showRegistrationReqsList();
    }
  }

  setAppMode(mode: AppMode = 'app'): boolean {
    if (mode !== this.appMode) {
      this.closeTopLeftComponent();
      this.closeSidePanelComponent();
      this._appMode$.next(mode);
      return true;
    }
    return false;
  }

  @ViewChild('sideNavSlotAnchor', { read: DynamicContainerDirective })
  sideNavSlotAnchor!: DynamicContainerDirective;
  @ViewChild('topLeftSlotAnchor', { read: DynamicContainerDirective })
  topLeftSlotAnchor!: DynamicContainerDirective;

  @ViewChild('sidePanelDrawer', { read: MatSidenav }) sideNav!: MatSidenav;

  downloadsCount$: Observable<number> = this.backgroundTasksService.taskListEmitter.pipe(
    map((taskList: TaskState[]) => taskList.length),
    startWith(0),
    shareReplay(1)
  );

  isHandset!: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      tap((isHandset) => (this.isHandset = isHandset)),
      shareReplay()
    );

  sidePanelComponentsSubscription: Subscription = new Subscription();

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private backgroundTasksService: BackgroundTasksService
  ) {
    this.registerSvgIcons();
  }

  toggleSideNav(drawer: any): void {
    if (this.isHandset) {
      drawer.toggle();
    }
  }

  showDownloadsList(): void {
    this.showSidePanelComponent(DownloadsListComponent, MenuItems.downloads);
  }

  showCostCentersList(): void {
    this.showTopLeftComponent(CostCenterListComponent);
  }

  showProductsList(): void {
    this.showTopLeftComponent(ProductListComponent);
  }

  showInputsList(): void {
    this.showTopLeftComponent(InputListComponent);
  }

  showFamiliesList(): void {
    this.showTopLeftComponent(ProductFamilyListComponent);
  }

  showUsersList() {
    this.showTopLeftComponent(UserListComponent);
  }

  showRegistrationReqsList() {
    this.showTopLeftComponent(RegistrationReqListComponent);
  }

  showSidePanelComponent(componentType: Type<any>, nemuIndex: number): any {
    let newComponent: any = null;
    if (this.selectedIndex === nemuIndex) {
      this.sideNav.close();
      this.selectedIndex = -1;
    } else {
      this.sidePanelComponentsSubscription.unsubscribe();
      newComponent = this.sideNavSlotAnchor.setComponent(componentType);
      this.sideNav.open();
      this.selectedIndex = nemuIndex;
    }
    return newComponent;
  }

  closeSidePanelComponent(): any {
    return this.sideNavSlotAnchor.clear();
  }

  private showTopLeftComponent(componentType: FloatingComponentConstructor): FloatingComponent {
    return this.topLeftSlotAnchor.setComponent(componentType);
  }

  closeTopLeftComponent(): any {
    return this.topLeftSlotAnchor.clear();
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigateByUrl('/auth/login');
  }

  registerSvgIcons() {
    [
      'close',
      'add',
      'add-blue',
      'airplane-front-view',
      'air-station',
      'balloon',
      'boat',
      'cargo-ship',
      'car',
      'catamaran',
      'clone',
      'convertible',
      'delete',
      'drone',
      'fighter-plane',
      'fire-truck',
      'horseback-riding',
      'motorcycle',
      'railcar',
      'railroad-train',
      'rocket-boot',
      'sailing-boat',
      'segway',
      'shuttle',
      'space-shuttle',
      'steam-engine',
      'suv',
      'tour-bus',
      'tow-truck',
      'transportation',
      'trolleybus',
      'water-transportation',
    ].forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
      );
    });
  }
}
