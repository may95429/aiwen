// 純 JS：只負責「自動切換 checked」+ 「hover 暫停」
// 不改你的 HTML 結構（radio/label 一樣可用）

(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const radios = Array.from(hero.querySelectorAll('input[type="radio"][name="hero"]'));
  if (radios.length === 0) return;

  const intervalMs = Number(hero.dataset.interval) || 5000;

  let timer = null;

  const getIndex = () => radios.findIndex(r => r.checked);
  const go = (nextIndex) => {
    const i = (nextIndex + radios.length) % radios.length;
    radios[i].checked = true;
  };

  const next = () => go(getIndex() + 1);

  const start = () => {
    stop();
    timer = setInterval(next, intervalMs);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  // ✅ hover 暫停 / 離開繼續
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);

  // ✅ 使用者點箭頭/圓點/任何 label 後：重啟計時（避免覺得卡住）
  hero.addEventListener("click", (e) => {
    const label = e.target.closest("label");
    if (!label) return;
    // 讓 radio 切換先完成（下一個 tick 再重啟）
    setTimeout(start, 0);
  });

  // ✅ 網頁一載入就開始輪播（第一張一定顯示，因為 hero-1 checked）
  start();
})();
