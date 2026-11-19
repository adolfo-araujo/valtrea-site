export function revealAsYouScroll(): void {
  const revealed = document.querySelectorAll<HTMLElement>(".revela");
  if (!("IntersectionObserver" in window)) {
    revealed.forEach((element) => element.classList.add("is-on"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-on");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );
  revealed.forEach((element) => {
    const siblings = [...(element.parentElement?.children ?? [])].filter((child) => child.classList.contains("revela"));
    if (siblings.length > 1) element.style.setProperty("--d", `${siblings.indexOf(element) * 80}ms`);
    observer.observe(element);
  });
}
