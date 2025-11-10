import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1) Försök scrolla window/dokumentet
    window.scrollTo(0, 0);
    document.documentElement && (document.documentElement.scrollTop = 0);
    document.body && (document.body.scrollTop = 0);

    // 2) Scrolla ev. interna containers
    const candidates = [
      document.querySelector('[data-scroll-root]'),
      document.getElementById('page-root'),
      document.querySelector('.page-container'),
      document.querySelector('main'),
    ].filter(Boolean);

    for (const el of candidates) {
      try {
        if ('scrollTo' in el) el.scrollTo(0, 0);
        else el.scrollTop = 0;
      } catch {}
    }
  }, [pathname]);

  return null;
}
