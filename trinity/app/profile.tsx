import { useAtom } from "jotai";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { sizes } from "@utils/sizes";
import { userAtom } from "@/hooks/auth";
import { Button, Icon, Input } from "@rneui/themed";
import { lightPrimary, primaryColor } from "@/utils/colors";
import { useGetProfile, useUpdateProfile } from "@/hooks/api/profile";
import { OrdersView } from "@/components/OrdersView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLogout } from "@/hooks/auth";

function profileView() {
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const logout = useLogout();
  const [isEditing, setIsEditing] = useState(false);

  const [userAtomValue, setUserAtom] = useAtom(userAtom);

  const { data, isLoading, error } = useGetProfile({
    onSuccess: (res) => {
      form.reset({
        firstName: res.first_name,
        lastName: res.last_name,
        email: res.email,
        username: res.username,
      });
      setUserAtom(() => {
        if (userAtomValue) {
          return { ...userAtomValue, username: res.username };
        }
        return null;
      });
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: data?.first_name || "",
      lastName: data?.last_name || "",
      email: data?.email || "",
      username: data?.username || "",
    },
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data || error) {
    return <Text>An error occured</Text>;
  }
  const initials = `${data.first_name?.[0].toUpperCase()} ${data.last_name?.[0].toUpperCase()}`;

  const accountCreationDate = new Date(data.creation_date).toLocaleDateString(
    "US"
  );

  return (
    <GestureHandlerRootView style={styles.pageContainer}>
      <View style={styles.profilePicUsernameContainer}>
        <View style={styles.profilePic}>
          <Text style={{ ...styles.white, ...styles.bold }}>{initials}</Text>
        </View>
        <Text style={styles.bold}>@{data.username}</Text>
      </View>
      {!isEditing ? (
        <>
          <View>
            <Text style={{ fontSize: 16 }}>First Name : {data.first_name}</Text>
            <Text style={{ fontSize: 16 }}>Last Name : {data.last_name}</Text>
            <Text style={{ fontSize: 16 }}>Email : {data.email}</Text>
            <Text style={{ fontSize: 16 }}>
              Member since : {accountCreationDate}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              type="outline"
              buttonStyle={{ width: 120 }}
              radius="md"
              onPress={() => setIsEditing(true)}
            >
              <Text>Edit</Text>
              <Icon name="edit" size={18} style={{ marginLeft: sizes.xs }} />
            </Button>

            <Button onPress={logout} radius="md" type="outline">
              <Text style={styles.logoutText}>Déconnexion</Text>
              <MaterialCommunityIcons
                name="logout"
                size={18}
                style={{ marginLeft: sizes.xs }}
              />
            </Button>
          </View>
        </>
      ) : (
        <View
          style={{
            backgroundColor: "#fff",
            padding: sizes.md,
            borderRadius: 12,
          }}
        >
          <Controller
            control={form.control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="First name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Last name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={form.control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <View
            style={{
              marginTop: sizes.sm,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              color={primaryColor}
              type="outline"
              radius="md"
              buttonStyle={{ width: "85%" }}
              onPress={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              color={primaryColor}
              type="solid"
              buttonStyle={{ width: "85%" }}
              onPress={form.handleSubmit(
                async ({ firstName, lastName, email, username }) => {
                  await updateProfile({
                    email,
                    username,
                    last_name: lastName,
                    first_name: firstName,
                  });
                  setIsEditing(false);
                }
              )}
              radius="md"
            >
              Update
            </Button>
          </View>
        </View>
      )}

      <OrdersView />
    </GestureHandlerRootView>
  );
}

export default profileView;

const styles = StyleSheet.create({
  profilePicUsernameContainer: {
    display: "flex",
    marginVertical: sizes.md,
    flexDirection: "column",
    gap: sizes.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  white: {
    color: "#FFF",
    fontSize: 20,
  },
  bold: {
    fontWeight: "700",
  },
  profilePic: {
    borderRadius: "50%",
    backgroundColor: lightPrimary,
    padding: 20,
  },
  pageContainer: {
    paddingHorizontal: sizes.md,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sizes.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 5,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: sizes.sm,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: sizes.md,
  },
});
