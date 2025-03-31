import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "utils/constants";

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: false,
  signIn: () => {},
  signOut: () => {},
  setIsLoading: (isLoading: boolean) => {},
  setIsAuthenticated: (isAuthenticated: boolean) => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);
    console.log("signing in");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === undefined) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.primary,
        }}
      >
        <ActivityIndicator color={"white"} size={"large"} />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        setIsLoading,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
