export function apply3DTilt(element, intensity = 15) {
  if (!element) return;

  function handleMove(e) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (y / rect.height) * intensity;
    const rotateY = -(x / rect.width) * intensity;

    element.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;
  }

  function reset() {
    element.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
  }

  element.addEventListener("mousemove", handleMove);
  element.addEventListener("mouseleave", reset);
}
