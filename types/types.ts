import React, { ReactElement } from "react";
import { SectionListData as RNSectionListData } from 'react-native';

export interface OfferItem {
    id: number;
    title: string;
    description: string;
    image: any;
    gradient: [string, string, string]; // Explicit tuple type
  }


  interface SectionListItem {
    // You can define the type of your item data here if needed
    // For example, if your items have specific properties:
    // id: number;
    // name: string;
    [key: string]: any; // Generic fallback if items can have any properties
  }
  
  export interface SectionListDataProps extends RNSectionListData<SectionListItem> {
    id: number;
    title: string;
    data: SectionListItem[];
    renderItem: () => React.ReactElement | null; // Must return ReactElement or null
  }

  type ImageRequireSource = ReturnType<typeof require>;

  export interface FoodTypesProps {
    id:number,
    name:string,
    image:ImageRequireSource
  }