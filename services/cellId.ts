import { NativeModules, Platform } from "react-native";

const { CellIdModule } = NativeModules;

export const getCurrentCellId = async (): Promise<string | null> => {
  if (Platform.OS !== "android") {
    return null;
  }

  if (!CellIdModule?.getCurrentCellId) {
    return null;
  }

  try {
    return await CellIdModule.getCurrentCellId();
  } catch (error) {
    console.warn("Cell ID read failed", error);
    return null;
  }
};
