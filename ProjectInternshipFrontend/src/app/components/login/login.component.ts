import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Subscription, tap } from 'rxjs';
import { CrossFieldErrorMatcher } from 'src/app/error/CrossFieldErrorMatcher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodeWithI18n } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  errorMatcher = new CrossFieldErrorMatcher();
  showPassword: boolean = false;
  showConfirmedPassword: boolean = false;
  
  errors: string[] = [];

  showError: boolean = false;
  isRegisterActive: boolean = true;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  private _subscriptionList: Subscription[] = [];

  constructor(
    private _formBuilder: FormBuilder, 
    private _loginService: LoginService, 
    private _router: Router, 
    private _activatedRoute: ActivatedRoute, 
    private _snackBar: MatSnackBar
    ) {
    this.createForm();
    this.createRegisterForm();
    this.verifyActivatedRoute();
   }
  

  ngOnInit(): void {
    if(localStorage.getItem('authenticationToken') !== null){
      this._router.navigate(['/products'])
    }
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  createForm(){
    this.loginForm = this._formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  createRegisterForm(){
    this.registerForm = this._formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      email: [null, [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{1,100})$')]],
      confirmPassword: [null, Validators.required]
    },{
      validator: this.passwordValidator
    })
  }

  login(){
    const formData = new FormData();
    formData.append('username', this.loginForm.controls['email'].getRawValue().toString());
    formData.append('password', this.loginForm.controls['password'].getRawValue().toString());

    this._subscriptionList.push(
    this._loginService.loginUser(formData).pipe(tap((response: HttpResponse<string>) => {if(response.ok){
    }})).subscribe({
      next: (response: HttpResponse<string>) => {
        this._loginService.getUser(this.loginForm.controls['email'].getRawValue().toString()).subscribe({
          next: (user: User) =>{
          localStorage.setItem('firstName', user.firstName!);
          localStorage.setItem('lastName', user.lastName!);
          localStorage.setItem('username', user.username!);
          localStorage.setItem('email', user.email!);
          localStorage.setItem('creationDate', user.creationDate!);
          console.log('Get user success: ', user);
          },
          error: (error: HttpErrorResponse) => {
            console.error('User not found!');
          }
        })
        console.log("Login Success!");
        const token = {
          value: 'true',
          expiry: new Date().getTime() + (300 * 1000)
        }
        // localStorage.setItem('authenticationToken', 'true');
        localStorage.setItem('authenticationToken', JSON.stringify(token))
        this.showError = false;
        this._router.navigate(['/products']);
      },
      error: (error: HttpErrorResponse) => {
        localStorage.clear();
        this.loginForm.reset();
        this.showError = true;
        console.error('Unauthorized user!');
      }
    })
    )
  }

  register(){
    this.errors = [];
    const registeredUser: User = {
      ...this.registerForm.getRawValue()
    };
    this._subscriptionList.push(
    this._loginService.registerUser(registeredUser).subscribe({
      next: (user: User) => {
        console.log('User registered with success: ', user);
        this._router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('User failed to register because: ', error.error);
        this.errors.push(error.error.concat('\n'));
        this.errors.forEach((error) => {this.openSnackBar(error)});
      }
    })
    )
  }

  reset(){
    this.registerForm.reset();
  }

  verifyActivatedRoute(){
    const url = this._activatedRoute.snapshot.routeConfig?.path
    if(url?.includes('login'))
    {
      this.isRegisterActive = false;
    }
    else{
      this.isRegisterActive = true;
    }
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('password')?.value !== form.get('confirmPassword')?.value;

    return condition ? { passwordsDoNotMatch: true} : null;
  }

  openSnackBar(errorMessage: string) {
    this._snackBar.open(errorMessage, 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10 * 1000
    });
  }
  
}

    
