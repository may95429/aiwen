// 取得元素
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

// 點擊 ☰ 時
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');

  // 更新 aria 狀態（無障礙）
  menuToggle.setAttribute('aria-expanded', isOpen);

  // 切換符號（☰ / ✕）
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

//footer 更新年份
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 點擊選單連結時，自動關閉選單（針對手機、平板）
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    // 如果選單目前是開啟的狀態才執行關閉
    if (mainNav.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', false);
      menuToggle.textContent = '☰';
    }
  });
});


//回到頂端按鈕

  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const triggerHeight = window.innerHeight * 0.9;

    if (window.scrollY > triggerHeight) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Header 捲動效果
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// 點首頁回頂部時，移除 header 的 scrolled class
document.querySelector('a[href="#header"]').addEventListener('click', (e) => {
  e.preventDefault(); // 防止預設跳轉
  window.scrollTo({ top: 0, behavior: 'smooth' }); // 滾回頂部

  header.classList.remove('scrolled');
});
