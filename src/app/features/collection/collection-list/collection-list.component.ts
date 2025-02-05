import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CollectionActions } from '@store/collection/collection.actions';
import {
  selectAllRequests,
  selectError,
  selectLoading,
} from '@store/collection/collection.selectors';
import {
  CollectionRequest,
  RequestStatus,
  WasteType,
} from '@core/models/collection.interface';
import {
  Calendar,
  Edit,
  LucideAngularModule,
  MapPin,
  Package,
  PlusCircle,
  Scale,
  Trash2,
} from 'lucide-angular';

@Component({
  selector: 'app-collection-list',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './collection-list.component.html',
  standalone: true,
})
export class CollectionListComponent implements OnInit {
  collections$;
  loading$;
  error$;

  protected readonly PlusCircle = PlusCircle;
  protected readonly Edit = Edit;
  protected readonly Trash2 = Trash2;
  protected readonly Package = Package;
  protected readonly Scale = Scale;
  protected readonly Calendar = Calendar;
  protected readonly MapPin = MapPin;
  protected readonly RequestStatus = RequestStatus;

  constructor(private store: Store) {
    this.collections$ = this.store.select(selectAllRequests);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.store.dispatch(CollectionActions.loadRequests());
  }

  deleteRequest(id: string): void {
    if (!confirm('Are you sure you want to delete this collection request?'))
      return;
    this.store.dispatch(CollectionActions.deleteRequest({ id }));
  }

  updateRequestStatus(id: string, status: RequestStatus): void {
    this.store.dispatch(
      CollectionActions.updateRequest({
        id,
        changes: { status },
      }),
    );
  }

  calculatePoints(request: CollectionRequest): number {
    if (!request.actualWeight) return 0;

    return request.wasteTypes.reduce((total, type) => {
      switch (type) {
        case WasteType.PLASTIC:
          return total + request.actualWeight! * 2;
        case WasteType.METAL:
          return total + request.actualWeight! * 5;
        case WasteType.GLASS:
        case WasteType.PAPER:
          return total + request.actualWeight!;
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
