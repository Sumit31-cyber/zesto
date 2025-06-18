import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  createContext,
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ItemAddon, Restaurant } from "types/types"; // Fixed: Import ItemAddon from types

interface CurrentCartItem {
  quantity: number;
  price: number;
  selectedOptions: ItemAddon[]; // Fixed: Use ItemAddon[] instead of CustomizationOption[]
}

interface SharedContextType {
  scrollY: SharedValue<number>;
  scrollYGlobal: SharedValue<number>;
  expanded: SharedValue<boolean>;
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  addonsModalRef: RefObject<BottomSheetModal>;
  selectedCustomizableItem: CurrentCartItem;
  setSelectedCustomizableItem: Dispatch<SetStateAction<CurrentCartItem>>;
  initializeCustomizableItem: (value: number) => void;
  showSplashScreen: boolean;
  setShowSplashScreen: (value: boolean) => void;
  activeAddonsMenuId: string;
  setActiveAddonsMenuId: Dispatch<SetStateAction<string>>;
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
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [activeAddonsMenuId, setActiveAddonsMenuId] = useState("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const addonsModalRef = useRef<BottomSheetModal>(null);
  const [selectedCustomizableItem, setSelectedCustomizableItem] =
    useState<CurrentCartItem>({
      quantity: 1,
      price: 0,
      selectedOptions: [],
    });

  const initializeCustomizableItem = (price: number) => {
    setSelectedCustomizableItem({
      quantity: 1,
      selectedOptions: [],
      price,
    });
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
        showSplashScreen,
        setShowSplashScreen,
        addonsModalRef,
        activeAddonsMenuId,
        setActiveAddonsMenuId,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);

  if (context === undefined) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }

  return context;
};
