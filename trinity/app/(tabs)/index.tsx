import { Product, ProductInShop } from "@/constants/interface/Product";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
  BarcodeScanningResult,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Button } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  AppState,
} from "react-native";
import { Audio } from "expo-av";
import useProductApi from "@/hooks/api/product";
import { router, usePathname, useRouter, useSegments } from "expo-router";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [bipSound, setBipSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setIsFocused(pathname === "/");
    console.log("Pathname", pathname);
    console.log("isFocused", isFocused);
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
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }
  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    console.log("Scanning...");
    await bip();
    await onBarCodeScanned(result.data);
  };
  async function bip() {
    console.log("Playing Sound");
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
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        active={isFocused}
      >
        <View style={styles.buttonContainer}></View>
      </CameraView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  productImage: {
    aspectRatio: 3 / 4,
    width: "50%",
    height: "66%",
    borderRadius: 30,
    margin: 10,
  },
  productCard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
  },
  message: {
    padding: 5,
  },
  camera: {
    flex: 1,
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
});
