import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";

function BookingItem({ tourName, price, paid, createdAt }) {
  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{tourName}</Text>
      <Text style={styles.cell}>{price}VND</Text>
      <Text style={styles.cell}>{paid ? "✅ Paid" : "❌ Unpaid"}</Text>
      <Text style={styles.cell}>{createdAt}</Text>
    </View>
  );
}
export default BookingItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.primary500,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary50,
  },
});
