import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private _authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  hasError = signal(false);
  isPosting = signal(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required]]
  });

  onSubmit() {
    if(this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      return;
    }
    const { email = '', password = '', fullName } = this.registerForm.value;
    this._authService.register(email!, password!, fullName!)
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
