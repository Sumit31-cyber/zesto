import { createContext, FC, PropsWithChildren, useContext } from "react";
import Animated, { useSharedValue } from "react-native-reanimated";

interface SharedContextType {
  scrollY: Animated.SharedValue<number>;
  scrollYGlobal: Animated.SharedValue<number>;
  //   scrollToTop: () => void;
}

const SharedStateContext = createContext<SharedContextType | undefined>(
  undefined
);
export const SharedStateProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrollY = useSharedValue(0);
  const scrollYGlobal = useSharedValue(0);
  return (
    <SharedStateContext.Provider value={{ scrollY, scrollYGlobal }}>
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
