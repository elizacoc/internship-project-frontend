import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { tap } from 'rxjs';
import { CrossFieldErrorMatcher } from 'src/app/error/CrossFieldErrorMatcher';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  errorMatcher = new CrossFieldErrorMatcher();
  showPassword: boolean = false;
  showConfirmedPassword: boolean = false;
  submitted: boolean = true;
  isAnyError: boolean = false;
  errors: string[] = []

  showError: boolean = false;
  isRegisterActive: boolean = true;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _loginService: LoginService, private _router: Router, private _activatedRoute: ActivatedRoute) {
    this.createForm();
    this.createRegisterForm();
    this.verifyActivatedRoute();
   }
  

  ngOnInit(): void {
    if(localStorage.getItem('authenticationToken') !== null){
      this._router.navigate(['/products'])
    }
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

    this._loginService.loginUser(formData).pipe(tap((response: HttpResponse<string>) => {if(response.ok){
    }})).subscribe({
      next: (response: HttpResponse<string>) => {
        this._loginService.getUser(this.loginForm.controls['email'].getRawValue().toString()).subscribe((user: User) =>{
        localStorage.setItem('firstName', user.firstName!);
        localStorage.setItem('lastName', user.lastName!);
        localStorage.setItem('username', user.username!);
        localStorage.setItem('email', user.email!);
        localStorage.setItem('creationDate', user.creationDate!);
      })
      console.log("Login Succes!");
      localStorage.setItem('authenticationToken', 'true')
      this._router.navigate(['/products']);
      this.showError = false;
      },
      error: (error: HttpErrorResponse) => {
        localStorage.clear()
        this.showError = true
        console.log(error.error)
      }
    });
  }

  register(){
    this.submitted = true;
    this.isAnyError = false;
    this.errors = [];
    const registeredUser: User = {
      ...this.registerForm.getRawValue()
    }
    this._loginService.registerUser(registeredUser).subscribe({
      next: (user: User) => {
        console.log(user)
        this.registerForm.reset();
        this._router.navigate(['/login'])
      },
      error: (error: HttpErrorResponse) => {
        this.isAnyError = true
        this.errors.push(error.error.concat('\n'))
      }
    })
    
  }

  verifyActivatedRoute(){
    const url = this._activatedRoute.snapshot.routeConfig?.path
    if(url?.includes('login'))
    {
      this.isRegisterActive = false
    }
    else{
      this.isRegisterActive = true
    }
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('password')?.value !== form.get('confirmPassword')?.value;

    return condition ? { passwordsDoNotMatch: true} : null;
  }
  
}

    
