import { Component, OnInit, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UtilsService } from '../../../../shared/services/utils.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {
      params: { timing: 1, delay: 0 }
    }))])
  ]
})

export class SignUpPageComponent implements OnInit {
  @ViewChild('signupForm') signupForm;

  signUpForm: FormGroup;
  firstName = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  lastName = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]);
  hide = true;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private utilsService: UtilsService
  ) {
    this.signUpForm = this.formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {
  }

  getErrorMessage(field) {
    if (this[field]?.hasError('required')) {
      return 'You must enter a value';
    } else if (this[field]?.hasError('email')) {
      return 'Not a valid email';
    } else if (this[field]?.hasError('pattern')) {
      return 'Not a valid password';
    }
  }

  sendForm() {
    if (this.signUpForm.valid) {
      const formValue = this.signUpForm.value;
      this.authService.signUp(formValue.firstName, formValue.lastName, formValue.email, formValue.password)
        .subscribe((response: any) => {
          if (!response.errors) {
            this.signupForm.resetForm();
            this.utilsService.showSnackBar('Cool! Now try to log in!', 'info-snack-bar');
          } else if (response.errors[0].code === 10000) {
            this.utilsService.showSnackBar('This email is not available. Try again, with a different one.', 'warning-snack-bar');
          }
        });
    }
  }

}
