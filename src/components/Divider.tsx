import { useColorScheme } from "nativewind";
import React, { memo } from "react";
import { StyleSheet, View, Text } from "react-native";

export function Divider({ color = "black" }: { color?: string }) {
  return (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: color,
        marginVertical: 20,
      }}
    ></View>
  );
}

export function DividerWithText({ title }: { title: string }) {
  return (
    <View style={styles.dividerContainer}>
      <View
        style={styles.dividerLine}
        className="bg-slate-300 dark:bg-slate-200"
      />
      <Text
        style={styles.dividerText}
        className="text-slate-500 dark:text-[#ddd]"
      >
        {title}
      </Text>
      <View
        style={styles.dividerLine}
        className="bg-slate-300 dark:bg-slate-200"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    justifyContent: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1.4,
  },
  dividerText: {
    marginHorizontal: 8,
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
});
