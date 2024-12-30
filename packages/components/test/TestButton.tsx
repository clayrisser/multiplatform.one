import type { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native-web";

interface TestButtonProps {
  children: ReactNode;
  onPress?: () => void;
}

export function TestButton({ children, onPress }: TestButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 8 }}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
