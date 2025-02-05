export enum WasteType {
  PLASTIC = 'PLASTIC',
  GLASS = 'GLASS',
  PAPER = 'PAPER',
  METAL = 'METAL',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  OCCUPIED = 'OCCUPIED',
  IN_PROGRESS = 'IN_PROGRESS',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

export interface CollectionRequest {
  id: string;
  particularId: string;
  wasteTypes: WasteType[];
  estimatedWeight: number;
  actualWeight?: number;
  address: string;
  collectionDateTime: Date;
  notes?: string;
  images?: string[];
  status: RequestStatus;
  collectorId?: string;
}
