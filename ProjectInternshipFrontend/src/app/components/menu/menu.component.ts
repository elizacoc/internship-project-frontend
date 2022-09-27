import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  isLoginActive: boolean = false;
  event?: Subscription;
  private _subscriptionList: Subscription[] = [];

  constructor(private _router: Router, private _loginService: LoginService) {
    this.event = this._router.events.subscribe((event: NavigationEvent) => {
      if(event instanceof NavigationEnd) {
        if(event.url.indexOf('/products') !== -1 || event.url.indexOf('/stocks') !== -1  || event.url.indexOf('/account') !== -1){
          this.isLoginActive = false;
        }
        else{
          this.isLoginActive = true;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.event?.unsubscribe();
    this._subscriptionList.forEach((subscription) => subscription.unsubscribe());
  }

  logout(){
    this._subscriptionList.push(
    this._loginService.logoutUser().subscribe({
      next: () => {
        localStorage.clear();
        console.log('Logout Success!');
        this._router.navigate(['/']);
      },
      error: () => {
        this._router.navigate(['/']);
      }
    })
    )
  }

}
