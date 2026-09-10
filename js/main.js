/*
  Video card behavior.

  Each .video-card in the project pages currently renders as a placeholder
  (no video hooked up yet). Once you've picked a video host, fill in the
  data attributes on the card and this script will swap the placeholder
  for a real embedded player on click:

    data-provider="youtube"        data-video-id="dQw4w9WgXcQ"
    data-provider="cloudflare"     data-video-id="<cloudflare-stream-uid>"
    data-provider="file"           data-video-id="assets/video/my-clip.mp4"

  See README.md for exactly where to get each ID.
*/

/*
  Video wall fade-in.

  Cards fade/drop in top-to-bottom on page load. The wall's columns adjust
  with viewport width (4 / 3 / 2 — see .video-wall media queries in
  style.css), so the delay is computed from the live column count rather
  than a fixed number, keeping rows in sync at any screen size.
*/
function initVideoWallFadeIn() {
  const wall = document.querySelector(".video-wall");
  if (!wall) return;

  const cards = Array.from(wall.querySelectorAll(".video-card"));
  if (!cards.length) return;

  const getColumns = () =>
    getComputedStyle(wall).gridTemplateColumns.split(" ").length || 1;

  const columns = getColumns();
  const rowDelayMs = 70;

  cards.forEach((card, i) => {
    const row = Math.floor(i / columns);
    card.style.setProperty("--fade-delay", `${row * rowDelayMs}ms`);
  });
}

/*
  Sliding nav indicator.

  A thin bar under the nav links that slides to whichever link is
  hovered, and slides back to the active page's link on mouseleave.
  Runs once per .site-nav found on the page — the header nav and the
  footer nav (a duplicate of it) each get their own independent indicator.
*/
function initNavIndicator() {
  document.querySelectorAll(".site-nav").forEach((nav) => {
    const indicator = nav.querySelector(".nav-indicator");
    const links = Array.from(nav.querySelectorAll("a"));
    if (!indicator || !links.length) return;

    const moveTo = (el) => {
      indicator.style.width = `${el.offsetWidth}px`;
      indicator.style.transform = `translateX(${el.offsetLeft}px)`;
    };

    const activeLink = nav.querySelector("a.active") || links[0];
    moveTo(activeLink);
    indicator.style.opacity = "1";

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => moveTo(link));
    });
    nav.addEventListener("mouseleave", () => moveTo(activeLink));
    window.addEventListener("resize", () => moveTo(activeLink));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initVideoWallFadeIn();
  initNavIndicator();

  document.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
      const provider = card.dataset.provider;
      const videoId = card.dataset.videoId;

      if (!videoId) {
        // No video hooked up yet — nothing to do.
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "video-embed";

      if (provider === "youtube") {
        wrapper.innerHTML = `<iframe
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0"
          title="${card.dataset.title || "Video"}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
      } else if (provider === "cloudflare") {
        wrapper.innerHTML = `<iframe
          src="https://iframe.videodelivery.net/${videoId}?autoplay=true"
          title="${card.dataset.title || "Video"}"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen></iframe>`;
      } else if (provider === "file") {
        wrapper.innerHTML = `<video src="${videoId}" controls autoplay playsinline></video>`;
      } else {
        return;
      }

      card.replaceWith(wrapper);
    });
  });
});
