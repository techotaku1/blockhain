export interface EnvironmentalReport {
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  type: 'natural' | 'anthropogenic';
  reporterId: string;
}

export type EnvironmentalReportInput = Partial<EnvironmentalReport>;

export interface PoapDropInput {
  name: string;
  description: string;
  city?: string;
  country?: string;
  start_date: string;
  end_date: string;
  expiry_date: string;
  event_url: string;
  image: string;
  email: string;
  requested_codes: number;
  year?: number;
  virtual_event?: boolean;
  private_event?: boolean;
  channel?: string;
  platform?: string;
  location_type?: string;
}

export interface PoapDrop extends PoapDropInput {
  id: number;
  fancy_id: string;
  image_url: string;
}

export interface PoapMintRequest {
  event_id: number;
  secret_code: string;
  redeem_type?: string;
}

export interface PoapEventResponse {
  id: number;
  fancy_id: string;
  name: string;
  event_url?: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  supply: number;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
}

export interface PoapRequestData {
  name: string;
  description: string;
  city?: string;
  country?: string;
  start_date: string;
  end_date: string;
  expiry_date: string;
  event_url: string;
  image: string;
  email: string;
  requested_codes: number;
}
