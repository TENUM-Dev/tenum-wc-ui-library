import React from "react";

type DelProps = {
  /**
   * Text to be represented within the `del` tag.
   */
  text: string;
}

/**
 * The del component adds the text to a `del`-tag.
 * The `<del>` tag defines text that has been deleted from a document. Browsers will usually strike a line through deleted text.
 */
export const Del = ({ text }: DelProps) => {
  return <del>{text}</del>;
};

export default Del;
