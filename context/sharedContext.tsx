import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  Ref,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";
import { CustomizationOption } from "utils/dataObject";

interface CurrentCartItem {
  quantity: number;
  price: number;
  selectedOptions: CustomizationOption[];
}

interface SharedContextType {
  scrollY: SharedValue<number>;
  scrollYGlobal: SharedValue<number>;
  expanded: SharedValue<boolean>;
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  selectedCustomizableItem: CurrentCartItem;
  setSelectedCustomizableItem: Dispatch<SetStateAction<CurrentCartItem>>;
  initializeCustomizableItem: (value: number) => void;
  //   scrollToTop: () => void;
}

const SharedStateContext = createContext<SharedContextType | undefined>(
  undefined
);
export const SharedStateProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrollY = useSharedValue(1);
  const scrollYGlobal = useSharedValue(0);
  const expanded = useSharedValue(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedCustomizableItem, setSelectedCustomizableItem] =
    useState<CurrentCartItem>({
      quantity: 1,
      price: 0,
      selectedOptions: [],
    });

  const initializeCustomizableItem = (price: number) => {
    setSelectedCustomizableItem((prev) => ({
      quantity: 1,
      selectedOptions: [],
      price,
    }));
  };
  return (
    <SharedStateContext.Provider
      value={{
        scrollY,
        scrollYGlobal,
        bottomSheetModalRef,
        selectedCustomizableItem,
        setSelectedCustomizableItem,
        initializeCustomizableItem,
        expanded,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);

  if (context == undefined) {
    throw new Error(
      "useSharedState must be used within a useSharedStateProvider"
    );
  }

  return context;
};
