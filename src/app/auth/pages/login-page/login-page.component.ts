import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private _authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if(this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }
    const { email = '', password = '' } = this.loginForm.value;
    this._authService.login(email!, password!)
    .subscribe((isAuthenticated) => {
      if(isAuthenticated) {
        this.router.navigateByUrl('/');
        return
      }
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
    });

  }

}
