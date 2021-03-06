import {Component, OnInit} from "@angular/core";
import {ControlGroup, FormBuilder, Validators, Control} from "@angular/common";
import {User} from "./user";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'my-signin',
  template: `
        <section class="col-md-8 col-md-offset-2">
            <form [ngFormModel]="myForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="email">Mail</label>
                    <input [ngFormControl]="myForm.find('email')" type="email" id="email" class="form-control">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input [ngFormControl]="myForm.find('password')" type="password" id="password" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="!myForm.valid">Sign Up</button>
            </form>
        </section>
    `
})
export class SigninComponent implements OnInit {
  myForm: ControlGroup;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _router: Router) {
  }

  onSubmit() {
    const { email, password } = this.myForm.value;
    console.log(this.myForm.value);
    const user = new User(email, password);
    this._authService.signIn(user)
      .subscribe(
        data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          this._router.navigateByUrl('/');
        },
        error => console.log(error)
      )
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      email: ['', Validators.compose([
        Validators.required,
        this.isEmail
      ])],
      password: ['', Validators.required]
    });
  }

  private isEmail(control: Control): {[s: string]: boolean} {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      return {invalidMail: true};
    }
  }
}