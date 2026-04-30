import { useThemeColor } from "@/shared/hooks/theme/useThemeColor";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  setVisible: (v: boolean) => void;
  children: React.ReactNode;
  initialSnapHeight?: number | string;
  maxSnapHeight?: number | string;
  type?: "default" | "scroll";
  onClose?: () => void;
};

export default function DynamicBottomSheet({
  visible,
  setVisible,
  children,
  initialSnapHeight = "50%",
  maxSnapHeight = "100%",
  type = "default",
  onClose,
}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const windowHeight = Dimensions.get("window").height;
  const backgroundColor = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  const snapPoints = useMemo(() => {
    const toNumber = (val: number | string) => {
      if (typeof val === "string" && val.endsWith("%")) {
        return (parseFloat(val) / 100) * windowHeight;
      }
      return typeof val === "string" ? parseFloat(val) : val;
    };
    const initial = toNumber(initialSnapHeight);
    const max = toNumber(maxSnapHeight);
    return initial === max ? [initial] : [initial, max];
  }, [initialSnapHeight, maxSnapHeight, windowHeight]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const sheetBackgroundStyle = {
    backgroundColor: backgroundColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  };

  const handleStyle = {
    backgroundColor: colorScheme === "dark" ? "#888" : "#ccc",
  };

  return (
    <View style={styles.overlay} pointerEvents={visible ? "auto" : "none"}>
      {visible && (
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor:
                colorScheme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
            },
          ]}
          onPress={() => {
            bottomSheetRef.current?.dismiss();
          }}
        />
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={() => {
          setVisible(false);
          onClose?.();
        }}
        backgroundStyle={sheetBackgroundStyle}
        handleIndicatorStyle={handleStyle}
      >
        {type === "scroll" ? (
          <BottomSheetScrollView
            style={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.content}>{children}</BottomSheetView>
        )}
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  content: {
    padding: 16,
  },
});
