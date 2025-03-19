import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

function CheckoutScreen({ route }) {
  const { checkoutUri } = route.params;
  return <WebView style={styles.container} source={{ uri: checkoutUri }} />;
}

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
