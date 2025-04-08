import React, { ComponentType } from "react";
import { Redirect, Tabs, useRouter } from "expo-router";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { lightPrimary, primaryColor } from "@/utils/colors";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuth, { useLogout, userAtom } from "@/hooks/auth";
import { useAtomValue } from "jotai";

function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const logout = useLogout();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: primaryColor,
        },
        headerShown: true,

        headerRight: () => {
          return (
            <TouchableOpacity style={styles.headerRightContainer}>
              <TouchableOpacity
                style={styles.profilePic}
                onPress={() => router.push("/profile")}
              >
                <Text style={{ ...styles.white, ...styles.bold }}>
                  {user && user.username[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
                <Text style={{ ...styles.bold }}>
                  <MaterialCommunityIcons name="logout" size={24} />
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home page",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan your product",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "barcode" : "barcode-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Product",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cube" : "cube-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Your cart",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cart" : "cart-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  white: {
    color: "#FFF",
    fontSize: 16,
  },
  bold: {
    fontWeight: "700",
  },
  profilePic: {
    borderRadius: 20,
    backgroundColor: lightPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    width: 40,
    height: 40,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  logoutIcon: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
    width: 50,
    height: 40,
  },
});

function withAuthentication<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { atomIsAuthenticated } = useAuth();
    const isAuthenticated = useAtomValue(atomIsAuthenticated);

    if (!isAuthenticated) {
      return <Redirect href={"/(auth)/login"} />;
    }

    // Render the wrapped component with its original props
    return <WrappedComponent {...props} />;
  };
}

export default withAuthentication(TabLayout);
