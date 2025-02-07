import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { ProfileService } from '@core/services/profile.service';
import { User } from '@core/models/user.interface';
import {
  LucideAngularModule,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Lock,
  Loader2,
  Save,
  Trash2,
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showPasswordForm = false;
  private destroy$ = new Subject<void>();

  protected readonly UserIcon = UserIcon;
  protected readonly Mail = Mail;
  protected readonly Phone = Phone;
  protected readonly Calendar = Calendar;
  protected readonly MapPin = MapPin;
  protected readonly Lock = Lock;
  protected readonly Loader2 = Loader2;
  protected readonly Save = Save;
  protected readonly Trash2 = Trash2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        if (user) {
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            birthdate: user.birthdate,
            address: user.address,
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthdate: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmitProfile() {
    if (this.profileForm.invalid || !this.currentUser?.id) return;

    this.error = null;
    this.success = null;
    this.loading = true;

    this.profileService
      .updateProfile(this.currentUser.id, this.profileForm.value)
      .subscribe({
        next: () => {
          this.success = 'Profile updated successfully';
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid || !this.currentUser?.id) return;

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.error = 'New password and confirm password do not match';
      return;
    }

    this.error = null;
    this.success = null;
    this.loading = true;

    this.profileService
      .updatePassword(this.currentUser.id, {
        currentPassword,
        newPassword,
      })
      .subscribe({
        next: () => {
          this.success = 'Password updated successfully';
          this.loading = false;
          this.passwordForm.reset();
          this.showPasswordForm = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  onDeleteAccount() {
    if (!this.currentUser?.id) return;

    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      this.loading = true;
      this.error = null;

      this.profileService.deleteAccount(this.currentUser.id).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
  }
}
