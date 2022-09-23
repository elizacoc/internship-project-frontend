import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
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

  constructor(private _router: Router, private _loginService: LoginService, private _activatedRoute: ActivatedRoute) {
    this.event = this._router.events.subscribe((event: NavigationEvent) => {
      if(event instanceof NavigationStart) {
        // if(event.url.indexOf('/login') !== -1){
        //   this.isLoginActive = true;
        // }
        // else{
        //   this.isLoginActive = false;
        // }
        if(event.url.indexOf('/products') !== -1 || event.url.indexOf('/stocks') !== -1  || event.url.indexOf('/account') !== -1){
          this.isLoginActive = false;
        }
        else{
          this.isLoginActive = true;
        }
      }
    });
  }
   
  logout(){
    this._loginService.logoutUser().subscribe(() => {
      localStorage.clear()
      console.log('Logout Success!');
      this._router.navigate(['/']);
    },
    () => {
      this._router.navigate(['/']);
    }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.event?.unsubscribe();
  }

}
