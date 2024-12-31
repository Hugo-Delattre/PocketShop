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
      <View>
        <Text style={styles.screnTitle}>Scan a product</Text>
      </View>

      <Image
        source={require("../../assets/images/background.png")}
        style={styles.backgroundImage}
      />

      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        active={isFocused}
        zoom={0.18}
      ></CameraView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  backgroundImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  camera: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    position: "absolute",
    width: 303,
    height: 450,
    left: 45,
    top: 250,
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
  screnTitle: {
    position: "absolute",
    width: 303,
    height: 28,
    left: 45,
    top: 125,
    fontFamily: "Crimson Text",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 28,
    lineHeight: 28,
    textAlign: "center",
    color: "#000000",
  },
});
