import { Collapse as ChakraCollapse, CollapseProps as ChakraCollapseProps } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

interface CollapseProps extends ChakraCollapseProps {
  /**
   * If `true`, the element will be transitioned back to the offset when it leaves. Otherwise, it'll only fade out.
   * @default true
   */
  animateOpacity?: boolean;

  /**
   * The height you want the content in its expanded state.
   * @default auto
   */
  endingHeight?: string | number;

  /**
   * Show the component; triggers when enter or exit states.
   * @default undefined
   */
  in?: boolean;

  /**
   * The height you want the content in its collapsed state.
   * @default 0
   */
  startingHeight?: string | number;

  /**
   * If `true`, the element will unmount when `in={false}` and animation is done.
   * @default undefined
   */
  unmountOnExit?: boolean;

  /**
   * Custom attribute alias for a more transparent understanding of the `in` property.
   * @default undefined
   */
  isOpen?: boolean;
}

export const Collapse: FC<PropsWithChildren<CollapseProps>> = ({
  children,
  isOpen = false, // Default to closed to work with Lua (which can't pass false directly)
  ...props
}) => {
  return (
    <ChakraCollapse in={isOpen} {...props}>
      {children}
    </ChakraCollapse>
  );
};

export default Collapse;

