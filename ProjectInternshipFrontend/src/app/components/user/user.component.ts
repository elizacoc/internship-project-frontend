import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CrossFieldErrorMatcher } from 'src/app/error/CrossFieldErrorMatcher';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  
  errorMatcher = new CrossFieldErrorMatcher();

  showPassword: boolean = false;
  showConfirmedPassword: boolean = false;

  errors: string[] = [];
  
  updateUserForm!: FormGroup;
  toggleUserUpdateForm: boolean = false;

  userDetails: User = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    creationDate: ""
  };

  userDetailsDataSource: User[] = [this.userDetails];

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.userDetailsDataSource);
  displayedColumns : string[] = ['firstName', 'lastName', 'username', 'email', 'creationDate'];

  private _subscriptionList: Subscription[] = [];

  constructor(
    private _formBuilder: FormBuilder, 
    private _loginService: LoginService, 
    private _snackBar: MatSnackBar) { 
    this.createAccountForm();
  }

  ngOnInit(): void {
    this.userDetails.firstName = localStorage.getItem('firstName') as string;
    this.userDetails.lastName = localStorage.getItem('lastName') as string;
    this.userDetails.email = localStorage.getItem('email') as string;
    this.userDetails.username = localStorage.getItem('username') as string;
    this.userDetails.creationDate = localStorage.getItem('creationDate') as string;
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription) => subscription.unsubscribe());
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
    this.errors = [];
    const userToPersist: User = {
      email: localStorage.getItem('email'),
      ...this.updateUserForm.getRawValue()
    }
    this._subscriptionList.push(
    this._loginService.updateUser(userToPersist).subscribe({
      next :(user: User) => {
        console.log('Success! The updated user is: ', user)
        localStorage.setItem('firstName', user.firstName!)
        localStorage.setItem('lastName', user.lastName!)
        localStorage.setItem('username', user.username!)
        window.location.reload()
      },
      error: (error: HttpErrorResponse) => {
        console.error('You cannot update the account because: ', error.error)
        this.errors.push(error.error.concat('\n'));
        this.errors.forEach((error) => {this.openSnackBar(error)})
      }
    })
    )
  }

  resetForm(){
    this.updateUserForm.reset();
  }

  toggleUserUpdate(){
    this.toggleUserUpdateForm = !this.toggleUserUpdateForm;
    this.updateUserForm.patchValue(this.userDetails);
  }

  passwordValidator(form: FormGroup) {
    const condition = form.get('password')?.value !== form.get('confirmPassword')?.value;

    return condition ? { passwordsDoNotMatch: true} : null;
  }

  openSnackBar(error: string){
    this._snackBar.open(error, 'Okay', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10 * 1000
    })
  }
}
