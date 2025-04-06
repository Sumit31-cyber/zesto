export interface OfferItem {
    id: number;
    title: string;
    description: string;
    image: any;
    gradient: [string, string, string]; // Explicit tuple type
  }