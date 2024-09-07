import { createInterFont } from "@tamagui/font-inter";
import { createDefaultFont } from "multiplatform.one";

export interface Fonts {
  body: ReturnType<typeof createInterFont>;
  heading: ReturnType<typeof createInterFont>;
  rockSalt: ReturnType<typeof createDefaultFont>;
  silkscreen: ReturnType<typeof createDefaultFont>;
}

export const fonts: Fonts = {
  rockSalt: createDefaultFont({
    family: "Rock Salt",
  }),
  silkscreen: createDefaultFont({
    family: "Silkscreen",
  }),
  heading: createInterFont({
    size: {
      6: 15,
    },
    transform: {
      6: "uppercase",
      7: "none",
    },
    weight: {
      6: "400",
      7: "700",
    },
    color: {
      6: "$colorFocus",
      7: "$color",
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: -1,
      9: -2,
      10: -3,
      12: -4,
      14: -5,
      15: -6,
    },
    face: {
      700: { normal: "InterBold" },
    },
  }),
  body: createInterFont(
    {
      face: {
        700: { normal: "InterBold" },
      },
    },
    {
      sizeSize: (size) => Math.round(size * 1.1),
      sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
    },
  ),
} as const;
