import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import AuthContextProvider, { AuthContext } from "./store/auth-context";
import TourProvider from "./store/tour-context";

import { Colors } from "./constants/colors";
import IconButton from "./components/UI/IconButton";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AllPlaces from "./screens/AllPlaces";
import PlaceDetails from "./screens/PlaceDetails";
import Map from "./screens/Map";
import ProfileScreen from "./screens/ProfileScreen";
import ManageProfileScreen from "./screens/ManageProfileScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        contentStyle: { backgroundColor: Colors.gray700 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: Colors.gray700,
        contentStyle: { backgroundColor: Colors.gray700 },
      }}
    >
      <Stack.Screen
        name="AllPlaces"
        component={AllPlaces}
        options={({ navigation }) => ({
          title: "All Tours",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="person-circle"
              color={tintColor}
              size={30}
              onPress={() => navigation.navigate("Profile")}
            />
          ),
        })}
      />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen
        name="PlaceDetails"
        component={PlaceDetails}
        options={{ title: "Loading place" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Your profile",
        }}
      />
      <Stack.Screen
        name="ManageProfile"
        component={ManageProfileScreen}
        options={{ title: "Edit your profile", presentation: "modal" }}
      />
      <Stack.Screen
        name="CheckoutSession"
        component={CheckoutScreen}
        options={{
          title: "Checkout",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <TourProvider>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
      </TourProvider>
    </>
  );
}
