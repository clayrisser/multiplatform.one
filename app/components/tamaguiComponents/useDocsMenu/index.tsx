import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { allNotPending } from '../DocsPage';

export const useDocsMenu = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  let currentPath = router.pathname;
  let documentVersion = '';

  if (Array.isArray(router.query.slug)) {
    currentPath = currentPath.replace('[...slug]', router.query.slug[0]);
    documentVersion = router.query.slug[1];
  } else {
    currentPath = currentPath.replace('[slug]', router.query.slug as string);
  }

  const documentVersionPath = documentVersion ? `/${documentVersion}` : '';
  const currentPageIndex = allNotPending.findIndex((page) => page.route === currentPath);
  const previous = allNotPending[currentPageIndex - 1];
  let nextIndex = currentPageIndex + 1;
  let next = allNotPending[nextIndex];
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  while (next && next.route.startsWith('http')) {
    next = allNotPending[++nextIndex];
  }

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return {
    router,
    open,
    setOpen,
    currentPath,
    next,
    previous,
    documentVersionPath,
  };
};
// Footer
// © 2023 GitHub, Inc.
// Footer navigation
// Terms
// Privacy
// Security
// Status
// Docs
// Contact GitHub
// Pricing
// API
// Training
// Blog
// About