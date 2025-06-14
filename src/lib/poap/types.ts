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
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  expiry_date: string;
  year: number;
  event_url: string;
  image: string;
  email: string;
  requested_codes: number;
}

export interface PoapDrop {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  status: string;
}

export interface PoapMintRequest {
  event_id: number;
  requested_codes: number;
  secret_code: string;
}

export interface PoapEventDetails extends PoapDrop {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
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
