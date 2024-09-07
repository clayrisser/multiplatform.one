import { useContext } from "react";
import { AnimationDriverTogglerContext } from "../providers/AnimationDriverTogglerContextProvider";

export const useAnimationDriverToggler = () => {
  const contextValue = useContext(AnimationDriverTogglerContext);
  if (!contextValue)
    throw new Error(
      "Should be used within the AnimationDriverTogglerContext provider",
    );
  return contextValue;
};
