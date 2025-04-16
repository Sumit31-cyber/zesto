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
import Animated, { useSharedValue } from "react-native-reanimated";
import { CustomizationOption } from "utils/dataObject";

interface CurrentCartItem {
  quantity: number;
  price: number;
  selectedOptions: CustomizationOption[];
}

interface SharedContextType {
  scrollY: Animated.SharedValue<number>;
  scrollYGlobal: Animated.SharedValue<number>;
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  selectedCustomisableItem: CurrentCartItem;
  setSelectedCustomisableItem: Dispatch<SetStateAction<CurrentCartItem>>;
  initializeCustomisableItem: (value: number) => void;
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedCustomisableItem, setSelectedCustomisableItem] =
    useState<CurrentCartItem>({
      quantity: 1,
      price: 0,
      selectedOptions: [],
    });

  const initializeCustomisableItem = (price: number) => {
    setSelectedCustomisableItem((prev) => ({
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
        selectedCustomisableItem,
        setSelectedCustomisableItem,
        initializeCustomisableItem,
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
