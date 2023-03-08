import React from 'react';

export interface HotelSelectProps {
  start: string;
  end: string;
}

export const HotelContext = React.createContext<{
  hotelSelect: HotelSelectProps;
  refreshHotelSelect: (info: HotelSelectProps) => void;
}>({} as any);
