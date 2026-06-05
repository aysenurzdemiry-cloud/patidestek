export interface VetClinic {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  district: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  media: string | null;
}
