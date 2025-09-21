export default function handleHeaderHeight(setHeaderHeight) {
  const header = document.querySelector("header");
  if (header) {
    setHeaderHeight(header.offsetHeight);

    const observe = new ResizeObserver((items) => {
      items.forEach((item) => {
        setHeaderHeight(item.contentRect.height);
      });
    });

    observe.observe(header);

    return () => {
      observe.unobserve(header);
      observe.disconnect();
    };
  }
}
