import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import {
  AlertCircle,
  Loader2,
  Lock,
  LucideAngularModule,
  Mail,
  UserPlus,
} from 'lucide-angular';
import { Role } from '@core/models/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field);
    return Boolean(
      formControl?.invalid && (formControl?.dirty || formControl?.touched),
    );
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = null;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user?.role === Role.COLLECTOR) {
          this.router.navigate(['/collection/collector-dashboard']);
        } else {
          this.router.navigate(['/collection/request']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message;
      },
    });
  }
  protected readonly Mail = Mail;
  protected readonly Lock = Lock;
  protected readonly Loader2 = Loader2;
  protected readonly UserPlus = UserPlus;
  protected readonly AlertCircle = AlertCircle;
}
