import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PointsActions } from '@store/points/points.actions';
import {
  selectPointsError,
  selectPointsLoading,
} from '@store/points/points.selectors';
import { AuthService } from '@core/services/auth.service';
import { COUPON_OPTIONS, CouponOption } from '@core/models/point.interface';
import { User } from '@core/models/user.interface';
import { Gift, Loader2, LucideAngularModule } from 'lucide-angular';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { PointsState } from '@store/points/points.reducer';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './points.component.html',
})
export class PointsComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading$ = this.store.select(selectPointsLoading);
  error$ = this.store.select(selectPointsError);
  successMessage: string = '';
  private destroy$ = new Subject<void>();

  protected readonly COUPON_OPTIONS = COUPON_OPTIONS;
  protected readonly GiftIcon = Gift;
  protected readonly Loader2 = Loader2;

  constructor(
    private store: Store<{ points: PointsState }>,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        console.log('User updated:', user); // For debugging
      });

    this.store
      .select((state) => state.points)
      .pipe(
        takeUntil(this.destroy$),
        filter((state) => !state.loading && !state.error), // Only process successful updates
      )
      .subscribe(() => {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.currentUser = user;
        }
      });

    this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      if (error) {
        this.successMessage = '';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  canRedeem(option: CouponOption): boolean {
    const currentPoints = this.currentUser?.points || 0;
    return currentPoints >= option.points;
  }

  onRedeemClick(option: CouponOption) {
    if (!this.canRedeem(option)) {
      return;
    }

    this.successMessage = '';
    this.store.dispatch(PointsActions.convertPoints({ option }));

    this.loading$
      .pipe(
        takeUntil(this.destroy$),
        filter((loading) => !loading),
        take(1),
      )
      .subscribe(() => {
        this.successMessage = `Successfully redeemed ${option.value} DH coupon!`;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      });
  }
}
