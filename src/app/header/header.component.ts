import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { User } from '../../models/user/user.model';
import { AuthService } from '@app/shared/services';
import { TasksDropDownViewerComponent } from '@app/tasks-drop-down-viewer/tasks-drop-down-viewer.component';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatMenu,
    TasksDropDownViewerComponent
  ],
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Input() showLogo: boolean = true;
  @Output() clickOnLogo: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    this.authService.signOut();
    this.router.navigateByUrl('/auth/login');
  }
}
