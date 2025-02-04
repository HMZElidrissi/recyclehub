import { Component, OnDestroy } from '@angular/core';
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
  Calendar,
  Image,
  Loader2,
  Lock,
  LogIn,
  LucideAngularModule,
  Mail,
  Phone,
  User,
} from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthdate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.registerForm.get(field);
    return Boolean(
      formControl?.invalid && (formControl?.dirty || formControl?.touched),
    );
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.error = null;

    let profilePicture = '';
    if (this.selectedFile) {
      try {
        profilePicture = await this.fileToBase64(this.selectedFile);
      } catch (error) {
        this.error = 'Failed to process profile picture';
        this.isLoading = false;
        return;
      }
    }

    const userData = {
      ...this.registerForm.value,
      profilePicture,
    };

    this.authService
      .register(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.authService
            .login(userData.email, userData.password)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => this.router.navigate(['/collection/list']),
              error: () => {
                this.error =
                  'Registration successful but login failed. Please try logging in.';
                this.router.navigate(['/auth/login']);
              },
            });
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.message;
        },
      });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  protected readonly User = User;
  protected readonly Mail = Mail;
  protected readonly Phone = Phone;
  protected readonly Lock = Lock;
  protected readonly Image = Image;
  protected readonly AlertCircle = AlertCircle;
  protected readonly Calendar = Calendar;
  protected readonly Loader2 = Loader2;
}
