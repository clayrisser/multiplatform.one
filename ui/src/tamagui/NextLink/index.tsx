import NextInternalLink from 'next/link';
import React from 'react';

export const NextLink = ((props) => {
  return <NextInternalLink {...props} className={`next-link ` + (props.className || '')} />;
}) as typeof NextInternalLink;
