import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useEffect, useState } from "react";
import { Button } from "@rneui/themed";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Audio } from "expo-av";

import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Dimensions } from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [bipSound, setBipSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setIsFocused(pathname === "/scan");
  }, [pathname]);

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bip.wav")
      );
      setBipSound(sound);
    }
    loadSound();
  }, []);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }
  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    await bip();
    await onBarCodeScanned(result.data);
  };
  async function bip() {
    if (bipSound) {
      await bipSound.replayAsync();
    }
  }

  async function onBarCodeScanned(data: string) {
    CameraView.dismissScanner();
    if (!data) {
      return;
    }
    router.push({ pathname: "/product", params: { productId: data } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraDiv}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarcodeScanned}
          active={isFocused}
        ></CameraView>
      </View>
    </SafeAreaView>
  );
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  camera: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    height: height * 0.5,
    margin: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  productName: {
    fontWeight: "bold",
  },
  buttonsPart: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cameraDiv: { marginTop: 100, borderRadius: 10, backgroundColor: "#0B132B" },
  screnTitle: {
    position: "absolute",
    width: 303,
    height: 28,
    left: 45,
    top: 100,
    fontFamily: "Crimson Text",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 28,
    lineHeight: 28,
    textAlign: "center",
    color: "#000000",
  },
});
