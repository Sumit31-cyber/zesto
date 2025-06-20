import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { FONTS, screenHeight } from "utils/constants";
import CustomText from "components/customText";
import { RFValue } from "react-native-responsive-fontsize";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";

import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserAddress,
  setUser,
  updateUserAddress,
} from "redux/slice/userSlice";
import { RootState } from "redux/store";
import Geolocation from "@react-native-community/geolocation";
import {
  ImageResponse,
  LocationCoordinateType,
  ReactNativeFile,
} from "types/types";
import { useSharedState } from "context/sharedContext";
import { useImagePicker } from "utils/CustomHook/useImagePicker";
import {
  addAddress,
  createUser,
  getUserInformation,
  uploadImage,
} from "utils/ApiManager";
import CustomHeader from "components/CustomHeader";

const OwnerDataSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const RestaurantLocationSchema = Yup.object().shape({
  addressLine1: Yup.string().required("Address is required"),
  addressLine2: Yup.string().notRequired(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string().required("Postal code is required"),
  country: Yup.string().required("Country is required"),
});

const RestaurantInformationSchema = Yup.object().shape({
  restaurantName: Yup.string().required("Restaurant name is required"),
  description: Yup.string(),
  restaurantEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  deliveryFee: Yup.number()
    .required("Delivery fee is required")
    .positive("Must be positive"),
  minOrderAmount: Yup.number()
    .required("Minimum order amount is required")
    .positive("Must be positive"),
  deliveryTime: Yup.string().required("Delivery time estimate is required"),
});

interface OwnerInfoFormValue {
  firstName: string;
  lastName: string;
  email: string;
}

interface RestaurantLocationFormValue {
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  postalCode: string;
  country: string;
}

const RegisterRestaurant = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();
  const { userInformation } = useSelector((state: RootState) => state.user);
  const mapRef = useRef<MapView | null>(null);
  const formikAddressRef =
    useRef<FormikProps<RestaurantLocationFormValue>>(null);

  const [locationCoordinate, setLocationCoordinate] =
    useState<LocationCoordinateType>({
      latitude: null,
      longitude: null,
    });

  const [locationLoading, setLocationLoading] = useState(true);

  const { pickImage, selectedImage, uploading } = useImagePicker();

  useEffect(() => {
    if (user?.id) {
      getUser();
    }
  }, [isLoaded]);

  // Get current position
  const getCurrentPosition = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      (info) => {
        console.log("Location coordinates:", info.coords);
        setLocationCoordinate({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        Alert.alert(
          "Location Error",
          "Unable to get your location. Please enable location services."
        );
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentPosition();
  }, []);

  // Handle form submission
  const handleLocationSubmit = async (
    values: RestaurantLocationFormValue,
    { setSubmitting }: FormikHelpers<RestaurantLocationFormValue>
  ) => {
    try {
      if (!locationCoordinate.latitude || !locationCoordinate.longitude) {
        Alert.alert(
          "Location Required",
          "Please pin point the location of your restaurant on the map"
        );
        return;
      }

      if (isLoaded && user?.id) {
        const existingAddressId =
          userInformation &&
          userInformation.addresses &&
          userInformation.addresses[0]
            ? userInformation.addresses[0].id
            : null;
        const addressResponse = await addAddress(
          user.id,
          values.addressLine1,
          values.addressLine2,
          values.state,
          values.city,
          values.postalCode,
          values.country,
          locationCoordinate.latitude,
          locationCoordinate.longitude,
          existingAddressId
        );

        console.log(addressResponse);
        if (addressResponse) {
          if (existingAddressId) {
            dispatch(
              updateUserAddress({
                id: existingAddressId,
                updates: addressResponse.address,
              })
            );
          } else {
            dispatch(addUserAddress(addressResponse));
          }
          router.back();
        }
      }
    } catch (error) {
      console.error("Location submission error:", error);
      Alert.alert("Error", "Failed to save location information");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMapPress = (event: MapPressEvent): void => {
    const { coordinate } = event.nativeEvent;

    setLocationCoordinate({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const initialRegion: Region =
    locationCoordinate.latitude && locationCoordinate.longitude
      ? {
          latitude: locationCoordinate.latitude,
          longitude: locationCoordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

  const getUser = async () => {
    console.log(user?.id);
    if (user?.id) {
      const userInformation = await getUserInformation(user.id);

      if (userInformation.success === false) {
        setCurrentStep(1);
        setIsLoading(false);
        return;
      }

      dispatch(setUser(userInformation.user));

      if (userInformation.user.addresses.length === 0) {
        setCurrentStep(2);
        setIsLoading(false);
        return;
      }
      if (!userInformation.user.ownedRestaurant) {
        setCurrentStep(3);
        setIsLoading(false);
        return;
      }
    }
  };

  const handleOwnerInfoSubmit = async (
    values: OwnerInfoFormValue,
    { setSubmitting }: FormikHelpers<OwnerInfoFormValue>
  ) => {
    try {
      if (
        userInformation &&
        userInformation.firstName === values.firstName &&
        userInformation?.lastName === values.lastName &&
        userInformation.email === values.email
      ) {
        console.log("No Change in fields");
        setCurrentStep(2);
        return;
      }
      if (user?.id) {
        const registeredUser = await createUser(
          user?.id,
          values.firstName,
          values.lastName,
          values.email,
          user.phoneNumbers[0].phoneNumber
        );

        if (registeredUser) {
          setCurrentStep(2);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save owner information");
    } finally {
      setSubmitting(false);
    }
  };

  const initialAddressValue = useMemo(() => {
    const existingAddress = userInformation?.addresses?.[0];

    const initialValue = {
      addressLine1: existingAddress?.addressLine1 || "",
      addressLine2: existingAddress?.addressLine2 || "",
      state: existingAddress?.state || "",
      city: existingAddress?.city || "",
      postalCode: existingAddress?.postalCode || "",
      country: existingAddress?.country || "",
    };

    return initialValue;
  }, [userInformation?.addresses]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={"#1bb183"} size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Add Information" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Step 1: Owner Information */}

        <View style={styles.stepContainer}>
          <View style={styles.progressContainer}>
            <PositionIndicator active={currentStep >= 1} />
            <StatusLine active={currentStep >= 1} />
          </View>
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <CustomText variant="h6">STEP 1</CustomText>
            </View>
            <CustomText variant="h6" style={styles.stepTitle}>
              Owner Information
            </CustomText>

            <CustomText variant="h7" style={styles.subtitle}>
              First name, Last name, Email address
            </CustomText>

            {currentStep === 1 && (
              <Formik
                initialValues={{
                  firstName: userInformation?.firstName || "",
                  lastName: userInformation?.lastName || "",
                  email: userInformation?.email || "",
                }}
                validationSchema={OwnerDataSchema}
                onSubmit={handleOwnerInfoSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <>
                    <View style={styles.formContainer}>
                      <View>
                        <TextInputTitle title="First name" />
                        <TextInput
                          placeholder="First name"
                          style={styles.textInput}
                          onChangeText={handleChange("firstName")}
                          onBlur={handleBlur("firstName")}
                          value={values.firstName}
                        />

                        {touched.firstName && errors.firstName && (
                          <AnimatedErrorMessage
                            errorMessage={errors.firstName}
                          />
                        )}
                      </View>

                      <View>
                        <TextInputTitle title="Last name" />
                        <TextInput
                          placeholder="Last name"
                          style={styles.textInput}
                          onChangeText={handleChange("lastName")}
                          onBlur={handleBlur("lastName")}
                          value={values.lastName}
                        />
                        {touched.lastName && errors.lastName && (
                          <AnimatedErrorMessage
                            errorMessage={errors.lastName}
                          />
                        )}
                      </View>

                      <View>
                        <TextInputTitle title="Email address" />
                        <TextInput
                          placeholder="Email address"
                          style={styles.textInput}
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          editable={!user?.emailAddresses[0]?.emailAddress}
                        />
                        {touched.email && errors.email && (
                          <AnimatedErrorMessage errorMessage={errors.email} />
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => handleSubmit()}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <CustomText variant="h6" style={styles.buttonText}>
                          Continue
                        </CustomText>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            )}
          </View>
        </View>

        {/* Step 2: Restaurant Location */}

        <View style={styles.stepContainer}>
          <View style={styles.progressContainer}>
            <PositionIndicator active={currentStep >= 2} />
          </View>
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <CustomText variant="h6">STEP 2</CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText variant="h6" style={styles.stepTitle}>
                Address
              </CustomText>
            </View>
            <CustomText variant="h7" style={styles.subtitle}>
              Address, State, City, Country, Postal code,
            </CustomText>

            {currentStep === 2 && (
              <Formik
                innerRef={formikAddressRef}
                initialValues={initialAddressValue}
                enableReinitialize={true}
                validationSchema={RestaurantLocationSchema}
                onSubmit={handleLocationSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <>
                    <View style={styles.formContainer}>
                      <View>
                        <View style={styles.mapContainer}>
                          {locationLoading ? (
                            <View style={styles.mapLoadingContainer}>
                              <ActivityIndicator size="large" color="#1bb183" />
                              <CustomText
                                variant="h7"
                                style={styles.loadingText}
                              >
                                Loading location...
                              </CustomText>
                            </View>
                          ) : locationCoordinate.latitude &&
                            locationCoordinate.longitude ? (
                            <MapView
                              ref={mapRef}
                              style={styles.map}
                              showsUserLocation
                              showsMyLocationButton
                              onPress={handleMapPress}
                              initialRegion={initialRegion}
                            >
                              {/* Current Location Marker */}
                              {locationCoordinate.latitude &&
                                locationCoordinate.longitude && (
                                  <Marker
                                    coordinate={{
                                      latitude: locationCoordinate.latitude,
                                      longitude: locationCoordinate.longitude,
                                    }}
                                    title="Your Location"
                                    pinColor="blue"
                                  />
                                )}

                              {/* Selected Restaurant Location Marker */}
                              {locationCoordinate.latitude &&
                                locationCoordinate.longitude && (
                                  <Marker
                                    coordinate={{
                                      latitude: locationCoordinate.latitude,
                                      longitude: locationCoordinate.longitude,
                                    }}
                                    title="Restaurant Location"
                                    description="Selected restaurant location"
                                    pinColor="red"
                                  />
                                )}
                            </MapView>
                          ) : (
                            <View style={styles.mapErrorContainer}>
                              <CustomText variant="h7" style={styles.errorText}>
                                Unable to load map
                              </CustomText>
                              <TouchableOpacity
                                style={styles.retryButton}
                                onPress={getCurrentPosition}
                              >
                                <CustomText
                                  variant="h7"
                                  style={styles.retryText}
                                >
                                  Retry
                                </CustomText>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <TextInputTitle title="Address line 1" />
                        <TextInput
                          placeholder="Address line 1"
                          style={styles.textInput}
                          onChangeText={handleChange("addressLine1")}
                          onBlur={handleBlur("addressLine1")}
                          value={values.addressLine1}
                        />
                        {touched.addressLine1 && errors.addressLine1 && (
                          <AnimatedErrorMessage
                            errorMessage={errors.addressLine1}
                          />
                        )}
                      </View>

                      <TextInputTitle title="Address line 2" />
                      <TextInput
                        placeholder="Address line 2"
                        style={styles.textInput}
                        onChangeText={handleChange("addressLine2")}
                        onBlur={handleBlur("addressLine2")}
                        value={values.addressLine2}
                      />
                      <View style={{ flexDirection: "row", gap: 10 }}>
                        <View style={{ flex: 1 }}>
                          <TextInputTitle title="State" />
                          <TextInput
                            placeholder="State"
                            style={styles.textInput}
                            onChangeText={handleChange("state")}
                            onBlur={handleBlur("state")}
                            value={values.state}
                          />
                          {touched.state && errors.state && (
                            <AnimatedErrorMessage errorMessage={errors.state} />
                          )}
                        </View>

                        <View style={{ flex: 1 }}>
                          <TextInputTitle title="city" />
                          <TextInput
                            placeholder="City"
                            style={styles.textInput}
                            onChangeText={handleChange("city")}
                            onBlur={handleBlur("city")}
                            value={values.city}
                          />
                          {touched.city && errors.city && (
                            <AnimatedErrorMessage errorMessage={errors.city} />
                          )}
                        </View>
                      </View>

                      <View>
                        <TextInputTitle title="Postal code" />
                        <TextInput
                          placeholder="Postal code"
                          style={styles.textInput}
                          onChangeText={handleChange("postalCode")}
                          onBlur={handleBlur("postalCode")}
                          value={values.postalCode}
                          keyboardType="numeric"
                        />
                        {touched.postalCode && errors.postalCode && (
                          <AnimatedErrorMessage
                            errorMessage={errors.postalCode}
                          />
                        )}
                      </View>

                      <View>
                        <TextInputTitle title="Country" />
                        <TextInput
                          placeholder="Country"
                          style={styles.textInput}
                          onChangeText={handleChange("country")}
                          onBlur={handleBlur("country")}
                          value={values.country}
                        />
                        {touched.country && errors.country && (
                          <AnimatedErrorMessage errorMessage={errors.country} />
                        )}
                      </View>
                    </View>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                          setCurrentStep(1);
                        }}
                      >
                        <CustomText variant="h6" style={styles.buttonText}>
                          Back
                        </CustomText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <CustomText variant="h6" style={styles.buttonText}>
                            Continue
                          </CustomText>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const AnimatedErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <CustomText variant="h6" style={styles.errorText}>
        {errorMessage}
      </CustomText>
    </Animated.View>
  );
};

const PositionIndicator = ({ active = false }: { active?: boolean }) => (
  <View
    style={[
      styles.indicatorContainer,
      { backgroundColor: active ? "#c9eadf" : "#e0e0e0" },
    ]}
  >
    <View
      style={[
        styles.indicatorDot,
        { backgroundColor: active ? "#1bb183" : "#9e9e9e" },
      ]}
    />
  </View>
);

const StatusLine = ({ active = false }: { active?: boolean }) => (
  <View
    style={[
      styles.statusLine,
      { backgroundColor: active ? "#1bb183" : "#d3d4d8" },
    ]}
  />
);

const TextInputTitle = ({ title }: { title: string }) => {
  return (
    <CustomText style={{ marginBottom: 5, letterSpacing: 0.8 }} variant="h7">
      {title}
    </CustomText>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    marginHorizontal: 10,
  },
  stepContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: RFValue(20),
  },
  progressContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    height: 30,
    justifyContent: "center",
  },
  stepTitle: {
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    color: "gray",
    marginBottom: 20,
  },
  formContainer: {
    gap: 20,
  },
  textInput: {
    height: RFValue(38),
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: RFValue(13),
    borderColor: "#e0e0e0",
    fontFamily: FONTS.Regular,
  },
  multilineInput: {
    height: RFValue(100),
    textAlignVertical: "top",
    paddingTop: 15,
  },
  errorText: {
    color: "red",
    fontSize: RFValue(12),
    marginTop: 4,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 30,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#1bb183",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFValue(15),
    borderRadius: 12,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFValue(15),
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  imageUploadContainer: {
    height: RFValue(150),
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
  },
  uploadContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadText: {
    color: "gray",
    fontSize: RFValue(12),
  },
  mapContainer: {
    height: screenHeight * 0.5,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  indicatorContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorDot: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 100,
  },
  statusLine: {
    height: "100%",
    width: 3,
  },

  header: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 5,
    fontWeight: "600",
  },
  map: {
    flex: 1,
  },
  mapLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  mapErrorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "gray",
  },
  retryButton: {
    backgroundColor: "#1bb183",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
  },
  fieldsContainer: {
    gap: 20,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
  },

  inputTitle: {
    marginBottom: 5,
    letterSpacing: 0.8,
    fontWeight: "500",
  },
  errorMessage: {
    color: "red",
    fontSize: RFValue(12),
    marginTop: 4,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 30,
    paddingBottom: 20,
  },

  primaryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "500",
  },
});

export default RegisterRestaurant;

const openingTime = [
  {
    day: "monday",
    open: "08:00",
    close: "20:00",
    isClosed: false,
  },
  {
    day: "tuesday",
    open: "08:00",
    close: "20:00",
    isClosed: false,
  },
  {
    day: "wednesday",
    open: "08:00",
    close: "20:00",
    isClosed: false,
  },
  {
    day: "thursday",
    open: "08:00",
    close: "22:00",
    isClosed: false,
  },
  {
    day: "friday",
    open: "08:00",
    close: "22:00",
    isClosed: false,
  },
  {
    day: "saturday",
    open: "10:00",
    close: "23:00",
    isClosed: false,
  },
  {
    day: "sunday",
    open: null,
    close: null,
    isClosed: true,
  },
];
