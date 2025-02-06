import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CollectionActions } from '@store/collection/collection.actions';
import {
  selectAllRequests,
  selectLoading,
} from '@store/collection/collection.selectors';
import {
  CollectionRequest,
  RequestStatus,
  WasteType,
} from '@core/models/collection.interface';
import { AuthService } from '@core/services/auth.service';
import {
  Calendar,
  Check,
  LucideAngularModule,
  MapPin,
  Scale,
  X,
  Image as ImageIcon,
  AlertTriangle,
  Upload,
} from 'lucide-angular';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './collector-dashboard.component.html',
})
export class CollectorDashboardComponent implements OnInit {
  requests$ = this.store.select(selectAllRequests);
  loading$ = this.store.select(selectLoading);
  validationForms: { [key: string]: FormGroup } = {};
  verifiedWasteTypes: { [key: string]: Set<WasteType> } = {};
  selectedImages: { [key: string]: File[] } = {};
  currentRequests: CollectionRequest[] = [];

  protected readonly RequestStatus = RequestStatus;
  protected readonly MapPin = MapPin;
  protected readonly Calendar = Calendar;
  protected readonly Scale = Scale;
  protected readonly Check = Check;
  protected readonly X = X;
  protected readonly ImageIcon = ImageIcon;
  protected readonly AlertTriangle = AlertTriangle;
  protected readonly Upload = Upload;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(CollectionActions.loadRequests());
    this.requests$.subscribe((requests) => {
      this.currentRequests = requests;
      requests.forEach((request) => {
        if (!this.validationForms[request.id]) {
          this.validationForms[request.id] = this.fb.group({
            actualWeight: [
              '',
              [
                Validators.required,
                Validators.min(1000),
                Validators.max(10000),
              ],
            ],
            notes: [''],
            images: [null],
          });
          this.verifiedWasteTypes[request.id] = new Set<WasteType>();
        }
      });
    });
  }

  updateStatus(id: string, status: RequestStatus): void {
    this.store.dispatch(
      CollectionActions.updateRequest({
        id,
        changes: {
          status,
          collectorId: this.authService.getCurrentUser()?.id,
        },
      }),
    );
  }

  validateRequest(request: CollectionRequest): void {
    if (!this.areAllWasteTypesVerified(request.id)) {
      alert('Please verify all waste types before validation');
      return;
    }

    const form = this.validationForms[request.id];
    if (form.valid) {
      const changes = {
        status: RequestStatus.VALIDATED,
        actualWeight: form.value.actualWeight,
        notes: form.value.notes,
      };

      if (this.selectedImages[request.id]?.length) {
        this.store.dispatch(
          CollectionActions.uploadImages({
            id: request.id,
            images: this.selectedImages[request.id],
          }),
        );
      }

      this.store.dispatch(
        CollectionActions.updateRequest({
          id: request.id,
          changes,
        }),
      );

      const points = this.calculatePoints(request, form.value.actualWeight);
      console.log('Points earned:', points);
    }
  }

  rejectRequest(request: CollectionRequest): void {
    const form = this.validationForms[request.id];
    this.store.dispatch(
      CollectionActions.updateRequest({
        id: request.id,
        changes: {
          status: RequestStatus.REJECTED,
          notes: form.value.notes,
        },
      }),
    );
  }

  isWasteTypeVerified(requestId: string, type: WasteType): boolean {
    return this.verifiedWasteTypes[requestId]?.has(type) || false;
  }

  toggleWasteTypeVerification(requestId: string, type: WasteType): void {
    if (!this.verifiedWasteTypes[requestId]) {
      this.verifiedWasteTypes[requestId] = new Set<WasteType>();
    }

    if (this.verifiedWasteTypes[requestId].has(type)) {
      this.verifiedWasteTypes[requestId].delete(type);
    } else {
      this.verifiedWasteTypes[requestId].add(type);
    }
  }

  areAllWasteTypesVerified(requestId: string): boolean {
    const request = this.currentRequests.find((r) => r.id === requestId);
    if (!request) return false;
    return request.wasteTypes.every((type) =>
      this.isWasteTypeVerified(requestId, type),
    );
  }

  onImagesSelected(event: Event, requestId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImages[requestId] = Array.from(input.files);
    }
  }

  calculatePoints(request: CollectionRequest, actualWeight: number): number {
    return request.wasteTypes.reduce((total, type) => {
      switch (type) {
        case WasteType.PLASTIC:
          return total + actualWeight * 2;
        case WasteType.METAL:
          return total + actualWeight * 5;
        case WasteType.GLASS:
        case WasteType.PAPER:
          return total + actualWeight;
        default:
          return total;
      }
    }, 0);
  }

  getStatusBadgeClass(status: RequestStatus): string {
    switch (status) {
      case RequestStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case RequestStatus.VALIDATED:
        return 'text-green-600 bg-green-50';
      case RequestStatus.REJECTED:
        return 'text-red-600 bg-red-50';
      case RequestStatus.OCCUPIED:
        return 'text-blue-600 bg-blue-50';
      case RequestStatus.IN_PROGRESS:
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}
