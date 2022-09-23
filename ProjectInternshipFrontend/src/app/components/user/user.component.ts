import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CrossFieldErrorMatcher } from 'src/app/error/CrossFieldErrorMatcher';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  errorMatcher = new CrossFieldErrorMatcher();

  showPassword: boolean = false;
  showConfirmedPassword: boolean = false;

  isAnyError: boolean = false;
  errors: string[] = [];
  
  updateUserForm!: FormGroup;
  toggleUserUpdateForm: boolean = false;

  userDetails: User = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    creationDate: ""
  }

  userDetailsDataSource: User[] = [this.userDetails]

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.userDetailsDataSource)
  displayedColumns : string[] = ['firstName', 'lastName', 'username', 'email', 'creationDate']

  constructor(private _formBuilder: FormBuilder, private _loginService: LoginService, private _router: Router) { 
    this.createAccountForm();
  }

  ngOnInit(): void {
    this.userDetails.firstName = localStorage.getItem('firstName') as string
    this.userDetails.lastName = localStorage.getItem('lastName') as string
    this.userDetails.email = localStorage.getItem('email') as string
    this.userDetails.username = localStorage.getItem('username') as string
    this.userDetails.creationDate = localStorage.getItem('creationDate') as string
  }

  createAccountForm(){
    this.updateUserForm = this._formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      password: [null, [Validators.required ,Validators.minLength(8), Validators.maxLength(20),  Validators.pattern('^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{1,100})$')]],
      confirmPassword: [null, [Validators.required]]
    },
    {validator: this.passwordValidator}
    )
  }

  updateAccount(){
    this.isAnyError = false;
    this.errors = [];
    const userToPersist: User = {
      email: localStorage.getItem('email'),
      ...this.updateUserForm.getRawValue()
    }
    this._loginService.updateUser(userToPersist).subscribe({
      next :(user: User) =>{
      console.log(user)
      // if(!user.password){
      //   window.location.reload()
      // } else {
      //   this._loginService.logoutUser().subscribe(() => {
      //   localStorage.clear()
      //   console.log('Logout Success!');
      //   this._router.navigate(['/']);
      //   },
      //   () => {
      //   this._router.navigate(['/']);
      //   });
      // }
      
      },
      error: (error: HttpErrorResponse) => {
        console.error('You cannot update the account because: ', error.error)
        this.isAnyError = true;
        this.errors.push(error.error.concat('\n'));
      }
    })
  }

  toggleUserUpdate(){
    this.toggleUserUpdateForm = !this.toggleUserUpdateForm;
    this.updateUserForm.patchValue(this.userDetails)
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('password')?.value !== form.get('confirmPassword')?.value;

    return condition ? { passwordsDoNotMatch: true} : null;
  }


}
