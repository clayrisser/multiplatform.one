import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { allNotPending } from '../../../app/components/tamaguiComponents/DocsPage';

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
  while (next?.route.startsWith('http')) {
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
