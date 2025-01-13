import { Product } from "@/constants/interface/Product";
import { Icon } from "@rneui/base";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { CartInfo } from "@/constants/interface/Cart";

const ProductCard = ({ product: cartInfo }: { product: CartInfo }) => {
  console.log("product", cartInfo.product.name);
  return (
    <SafeAreaView>
      <View key={cartInfo.product.id} style={styles.productCard}>
        <Image
          source={{
            uri: cartInfo.product.image_url,
          }}
          style={styles.productImage}
        />
        <View style={styles.cardInfo}>
          <ThemedText numberOfLines={3} ellipsizeMode="tail">
            {cartInfo.product.name}
          </ThemedText>
          <View style={{ flexDirection: "row" }}>
            <ThemedText style={styles.price}>{cartInfo.price} €</ThemedText>
            <View style={styles.quantity}>
              <TouchableOpacity
                style={styles.btnRemove}
                onPress={() => console.log("remove")}
              >
                <Icon name={"remove"} size={15} color="white" />
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>
                {cartInfo.availableQuantity}
              </ThemedText>
              <TouchableOpacity
                style={styles.btnAdd}
                onPress={() => console.log("add")}
              >
                <Icon name={"add"} size={15} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: 100,
    height: 100,
    margin: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 2,
    padding: 2,
  },
  price: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: "500",
  },
  quantity: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 30,
    marginLeft: 5,
    width: "50%",
  },
  btnRemove: {
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 50,
    margin: 5,
  },
  quantityText: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: "600",
  },
  btnAdd: {
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    backgroundColor: "green",
    borderRadius: 50,
    margin: 5,
  },
});
