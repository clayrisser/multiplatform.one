export const getBoundingClientRectAsync = (element: Element): Promise<DOMRectReadOnly | undefined> =>
  new Promise((resolve) => {
    const observer = new ResizeObserver((entries, ob) => {
      ob.disconnect();
      resolve(entries[0]?.contentRect);
    });

    observer.observe(element);
  });
