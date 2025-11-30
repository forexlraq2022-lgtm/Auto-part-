export enum CarOrigin {
  KOREAN = 'كوري',
  CHINESE = 'صيني',
  AMERICAN = 'أمريكي',
  OTHER = 'أخرى'
}

export interface InventoryItem {
  id: string;
  partNumber: string; // رقم الإشارة / المنتج
  name: string;
  origin: CarOrigin;
  price: number;
  quantity: number;
  description?: string;
  customerRef?: string; // مرجع الزبون
}

export interface AISearchResult {
  detectedName: string;
  confidence: number;
  description: string;
  possiblePartNumbers: string[];
}
