import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogMessageService } from 'src/app/core/services/dialog-message.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/+state/app.state';
import { logout } from 'src/app/authentication/+state/authentication.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    private dialogMessageService: DialogMessageService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.router.navigateByUrl('/login');
  }

  logOut() {
    this.dialogMessageService.confirmMessage('Bạn có muốn đăng xuất?', () => {
      this.store.dispatch(logout({}));
    })
  }
  ngOnDestroy() {}

}
