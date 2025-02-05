import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '@core/services/collection.service';
import {
  CollectionRequest,
  WasteType,
} from '@core/models/collection.interface';
import {
  ArrowLeft,
  Badge,
  BadgeInfo,
  Calendar,
  Clock,
  Image,
  LucideAngularModule,
  MapPin,
  Save,
  Scale,
  Trash,
} from 'lucide-angular';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './collection-form.component.html',
})
export class CollectionFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  minDate: string;
  selectedImages: { file: File; preview: string }[] = [];
  wasteTypeOptions = Object.values(WasteType);
  timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly MapPin = MapPin;
  protected readonly Scale = Scale;
  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly Save = Save;
  protected readonly Image = Image;
  protected readonly Trash = Trash;

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.form = this.fb.group({
      wasteTypes: [[], [Validators.required, Validators.minLength(1)]],
      estimatedWeight: [
        '',
        [Validators.required, Validators.min(1000), Validators.max(10000)],
      ],
      address: ['', Validators.required],
      collectionDate: ['', Validators.required],
      collectionTime: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadRequest(id);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push({
            file,
            preview: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  loadRequest(id: string): void {
    this.loading = true;
    this.collectionService.getUserRequests().subscribe({
      next: (requests) => {
        const request = requests.find((r) => r.id === id);
        if (request) {
          const collectionDate = new Date(request.collectionDateTime);

          this.form.patchValue({
            wasteTypes: request.wasteTypes,
            estimatedWeight: request.estimatedWeight,
            address: request.address,
            collectionDate: collectionDate.toISOString().split('T')[0],
            collectionTime:
              collectionDate.getHours().toString().padStart(2, '0') + ':00',
            notes: request.notes,
          });

          // Load images if any
          if (request.images?.length) {
            this.selectedImages = request.images.map((url) => ({
              file: new File([], url.split('/').pop() || ''),
              preview: url,
            }));
          }
        } else {
          this.error = 'Request not found';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const formValue = this.form.value;
    const collectionDateTime = new Date(formValue.collectionDate);
    const [hours] = formValue.collectionTime.split(':');
    collectionDateTime.setHours(parseInt(hours), 0, 0, 0);

    const requestData: Omit<
      CollectionRequest,
      'id' | 'collectorId' | 'status' | 'particularId'
    > = {
      wasteTypes: formValue.wasteTypes,
      estimatedWeight: formValue.estimatedWeight,
      address: formValue.address,
      collectionDateTime,
      notes: formValue.notes,
      images: this.selectedImages.map((img) => img.preview),
    };

    const operation = this.isEditMode
      ? this.collectionService.updateRequest(
          this.route.snapshot.paramMap.get('id')!,
          requestData,
        )
      : this.collectionService.createRequest(requestData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/collections/list']);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/collections/list']);
  }

  onWasteTypeChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const wasteType = checkbox.value as WasteType;
    const currentTypes =
      (this.form.get('wasteTypes')?.value as WasteType[]) || [];

    if (checkbox.checked) {
      this.form.get('wasteTypes')?.setValue([...currentTypes, wasteType]);
    } else {
      this.form
        .get('wasteTypes')
        ?.setValue(currentTypes.filter((type) => type !== wasteType));
    }
  }

  protected readonly Badge = Badge;
  protected readonly BadgeInfo = BadgeInfo;
}
