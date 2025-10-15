import React from "react";

export type HelloProps = {
  name?: string;
  onHelloClick?: (data: { name: string }) => void;
};

const Hello: React.FC<HelloProps> = ({
  name = "World",
  onHelloClick
}): JSX.Element => {
  const handleClick = () => {
    console.warn(`You clicked on Hello, ${name}!`);

    if (onHelloClick) {
      onHelloClick({ name });
    }
  };

  return (
    <span
      onClick={handleClick}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      Hello, {name}!
    </span>
  );
};

export default Hello;
