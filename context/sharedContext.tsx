import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  createContext,
  FC,
  PropsWithChildren,
  Ref,
  RefObject,
  useContext,
  useRef,
} from "react";
import Animated, { useSharedValue } from "react-native-reanimated";

interface SharedContextType {
  scrollY: Animated.SharedValue<number>;
  scrollYGlobal: Animated.SharedValue<number>;
  bottomSheetModalRef: RefObject<BottomSheetModal>;
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

  return (
    <SharedStateContext.Provider
      value={{
        scrollY,
        scrollYGlobal,
        bottomSheetModalRef,
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
