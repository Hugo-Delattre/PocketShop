import { Platform } from "react-native";
import { Buffer } from "buffer";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export async function saveFile({
  filename,
  buffer,
}: {
  filename: string;
  buffer: Buffer;
}) {
  try {
    const base64Data =
      typeof buffer === "string"
        ? buffer
        : Buffer.from(buffer).toString("base64");

    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Télécharger le PDF",
      });
      return { success: true };
    }
    if (Platform.OS === "android") {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        return { success: true };
      }
      throw new Error("Permission de stockage refusée");
    }
    throw new Error("Partage non disponible sur cet appareil");
  } catch (error) {
    return {
      success: false,
      message: error as string,
    };
  }
}
