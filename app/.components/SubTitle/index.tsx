import React, { Fragment } from 'react';
import { H3 } from 'tamagui';

export const nbspLastWord = (sentence: string) => {
  if (typeof sentence !== 'string') {
    return sentence;
  }
  const titleWords = sentence.split(' ');
  if (titleWords.length === 1) {
    return sentence;
  }
  return titleWords.map((word, i) => {
    return i === titleWords.length - 1 ? (
      <Fragment key={i}>&nbsp;{word}</Fragment>
    ) : (
      <Fragment key={i}> {word}</Fragment>
    );
  });
};

export const SubTitle = ({ children, ...props }) => {
  if (!children) {
    return null;
  }

  // takes the text even if it's wrapped in `<p>`
  // https://github.com/wooorm/xdm/issues/47
  const childText = typeof children === 'string' ? children : children.props.children;
  return (
    <H3
      pos="relative"
      width="max-content"
      size="$8"
      color="$gray9"
      fontFamily="$body"
      fontWeight="300"
      tag="p"
      mb="$2"
      mt="$0"
      maxWidth="80%"
      $sm={{
        maxWidth: '100%',
        size: '$6',
      }}
      {...props}
    >
      {nbspLastWord(childText)}
    </H3>
  );
};
