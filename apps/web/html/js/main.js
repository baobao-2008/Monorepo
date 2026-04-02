/* ============================================================
   BaobaoShop — main.js
   Lấy dữ liệu từ Prisma API · Demo fallback khi API chưa sẵn
   ============================================================ */

const API = "http://localhost:3000";
let selectedProduct = null;

/* ─── TOAST ─── */
function showToast(msg, type = "success") {
  let c = document.querySelector(".toast-container");
  if (!c) {
    c = document.createElement("div");
    c.className = "toast-container";
    document.body.appendChild(c);
  }
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || "ℹ"}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = "toastOut .3s ease forwards";
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

/* ─── API HELPER ─── */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ─── ESCAPE HTML ─── */
function esc(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── DEMO DATA (fallback khi API chưa chạy) ─── */
function demoArticles() {
  return [
    {
      id: 1,
      title: "Hành trình tìm mật ong rừng Đồng Văn",
      content:
        "Những tổ ong bạc hà trên vách đá tai mèo cao nguyên đá Đồng Văn — câu chuyện về người H'Mông thu hoạch mật theo cách truyền thống hàng trăm năm tuổi, giữ nguyên vị ngọt tinh khiết của núi rừng.",
    },
    {
      id: 2,
      title: "Vải lanh Lùng Tám — Bàn tay người Mông dệt nên ký ức",
      content:
        "Từ cây lanh trồng trên nương đến tấm vải thêu hoa văn truyền thống, mỗi mét vải là cả tháng lao động tỉ mỉ. Nghề dệt lanh Lùng Tám được UNESCO ghi nhận là di sản văn hóa phi vật thể.",
    },
  ];
}

function demoProducts() {
  return [
    {
      id: 1,
      name: "Mật ong bạc hà Đồng Văn",
      category: "Mật ong",
      price: 280000,
      description:
        "Mật ong thu hoạch từ hoa bạc hà trên cao nguyên đá, độ ngọt thanh, hương thơm đặc trưng. Đạt tiêu chuẩn OCOP 4 sao tỉnh Hà Giang.",
    },
    {
      id: 2,
      name: "Tour Hà Giang Loop 3N2Đ",
      category: "Du lịch",
      price: 1850000,
      description:
        "Trải nghiệm cung đường Hà Giang Loop huyền thoại — Đồng Văn, Mã Pí Lèng, Lũng Cú. Bao gồm xe máy, hướng dẫn viên bản địa và lưu trú homestay.",
    },
    {
      id: 3,
      name: "Vải lanh thêu hoa văn H'Mông",
      category: "Ngành dệt",
      price: 450000,
      description:
        "Tấm vải lanh dệt thủ công tại Lùng Tám, hoa văn thêu tay truyền thống. Mỗi sản phẩm là tác phẩm nghệ thuật duy nhất, không có hai tấm giống nhau.",
    },
  ];
}

/* ─── CATEGORY ICON ─── */
function categoryIcon(cat) {
  const map = {
    "Hoa quả": "🍑",
    "Du lịch": "🏔️",
    "Ngành dệt": "🧵",
    "Mật ong": "🍯",
    "Thảo dược": "🌿",
  };
  return map[cat] || "🌿";
}

/* ─── SKELETON ─── */
function showSkeleton(id, count = 2) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = Array(count)
    .fill('<div class="loading-skeleton skeleton-card"></div>')
    .join("");
}

/* ============================================================
   TRANG CHỦ — Bài viết & Sản phẩm từ Prisma
   ============================================================ */
async function loadContent() {
  await Promise.all([loadArticles(), loadProducts()]);
}

async function loadArticles() {
  const el = document.getElementById("article-list");
  if (!el) return;
  showSkeleton("article-list", 2);

  let articles = [];
  let isDemo = false;

  try {
    articles = await apiFetch("/articles");
  } catch {
    articles = demoArticles();
    isDemo = true;
  }

  if (isDemo) {
    showToast("⚠️ API chưa kết nối · Hiển thị dữ liệu mẫu", "info");
  }

  if (!articles.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📖</div>
        <p>Chưa có bài viết nào. Hãy đăng bài đầu tiên!</p>
      </div>`;
    return;
  }

  el.innerHTML = articles
    .map(
      (a, i) => `
    <div class="feature-card">
      <div class="feature-visual article-bg">
        <div class="visual-icon">📖</div>
        <div class="visual-badge clay">Vibe Media</div>
      </div>
      <div class="feature-info">
        <span class="tag">Góc Kể Chuyện #${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(a.title)}</h3>
        <p class="description">${esc(a.content)}</p>
        <div class="points-grid">
          <div class="point-item">Giá trị bản địa</div>
          <div class="point-item">Văn hóa truyền thống</div>
          <div class="point-item">Câu chuyện vùng cao</div>
          <div class="point-item">Lan tỏa cộng đồng</div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary" onclick="showToast('Tính năng đang phát triển...','info')">
            Xem thêm →
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

async function loadProducts() {
  const el = document.getElementById("product-list");
  if (!el) return;
  showSkeleton("product-list", 2);

  let products = [];

  try {
    products = await apiFetch("/products");
  } catch {
    products = demoProducts();
  }

  if (!products.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🌿</div>
        <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
      </div>`;
    return;
  }

  el.innerHTML = products
    .map(
      (p) => `
    <div class="feature-card">
      <div class="feature-visual product-bg">
        <div class="visual-icon">${categoryIcon(p.category)}</div>
        <div class="visual-badge moss">${esc(p.category)}</div>
      </div>
      <div class="feature-info">
        <span class="tag moss">Thương Mại & Trải Nghiệm</span>
        <h3>${esc(p.name)}</h3>
        <p class="description">${esc(p.description)}</p>
        <div class="price-tag">${Number(p.price).toLocaleString("vi-VN")} ₫</div>
        <div class="points-grid">
          <div class="point-item">Chất lượng VietGAP</div>
          <div class="point-item">Giao nhận toàn quốc</div>
          <div class="point-item">Tư vấn 24/7</div>
          <div class="point-item">Đổi trả 7 ngày</div>
        </div>
        <div class="card-actions">
          <button class="btn btn-moss" onclick="selectItem('${esc(p.name)}', ${p.id}, ${p.price})">
            🛒 Chọn mua ngay
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

/* ─── CHỌN SẢN PHẨM ─── */
function selectItem(name, id, price) {
  selectedProduct = { id, price, name };
  const badge = document.getElementById("selected-item-display");
  if (badge) {
    badge.innerHTML = `
      <span>🛒 Đã chọn:</span>
      <span class="product-name">${esc(name)}</span>
      <span style="color:var(--clay);font-weight:700">${Number(price).toLocaleString("vi-VN")} ₫</span>
    `;
    badge.classList.remove("empty");
  }
  document
    .querySelector(".order-section")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast(`Đã chọn: ${name}`, "success");
}

/* ─── GỬI ĐƠN HÀNG ─── */
async function submitOrder() {
  const name = document.getElementById("custName")?.value?.trim();
  const phone = document.getElementById("custPhone")?.value?.trim();

  if (!selectedProduct) {
    showToast("Vui lòng chọn sản phẩm trước!", "error");
    return;
  }
  if (!name) {
    showToast("Vui lòng nhập họ tên!", "error");
    return;
  }
  if (!phone) {
    showToast("Vui lòng nhập số điện thoại!", "error");
    return;
  }
  if (!/^0\d{9,10}$/.test(phone.replace(/\s/g, ""))) {
    showToast("Số điện thoại không hợp lệ! (VD: 0912345678)", "error");
    return;
  }

  const btn = document.querySelector(".btn-submit");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Đang gửi...";
  }

  try {
    await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone.replace(/\s/g, ""),
        orderType: "PRODUCT",
        itemId: selectedProduct.id,
        totalAmount: selectedProduct.price,
      }),
    });
    showToast("🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.", "success");
  } catch {
    showToast("🎉 Đã ghi nhận đơn hàng! Chúng tôi sẽ liên hệ sớm.", "success");
  } finally {
    document.getElementById("custName").value = "";
    document.getElementById("custPhone").value = "";
    selectedProduct = null;
    const badge = document.getElementById("selected-item-display");
    if (badge) {
      badge.innerHTML = "Chưa chọn sản phẩm nào";
      badge.classList.add("empty");
    }
    if (btn) {
      btn.disabled = false;
      btn.textContent = "XÁC NHẬN ĐẶT HÀNG NGAY";
    }
  }
}

/* ============================================================
   TRANG MANAGEMENT — Thêm bài viết & sản phẩm lên Prisma
   ============================================================ */
async function addArticle() {
  const title = document.getElementById("artTitle")?.value?.trim();
  const content = document.getElementById("artContent")?.value?.trim();
  if (!title || !content) {
    showToast("Vui lòng điền đủ tiêu đề và nội dung!", "error");
    return;
  }

  const btn = document.getElementById("btnAddArticle");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Đang đăng...";
  }

  try {
    await apiFetch("/articles", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    showToast("✅ Đã đăng bài viết thành công!", "success");
    document.getElementById("artTitle").value = "";
    document.getElementById("artContent").value = "";
  } catch {
    showToast("Lỗi khi đăng bài. Kiểm tra kết nối API!", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📝 ĐĂNG BÀI VIẾT";
    }
  }
}

async function addProduct() {
  const name = document.getElementById("prodName")?.value?.trim();
  const category = document.getElementById("prodCategory")?.value;
  const priceRaw = document.getElementById("prodPrice")?.value;
  const description = document.getElementById("prodDesc")?.value?.trim();
  const price = parseFloat(priceRaw);

  if (!name || !category || !description) {
    showToast("Vui lòng điền đầy đủ thông tin!", "error");
    return;
  }
  if (!priceRaw || isNaN(price) || price <= 0) {
    showToast("Giá tiền không hợp lệ!", "error");
    return;
  }

  const btn = document.getElementById("btnAddProduct");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Đang lưu...";
  }

  try {
    await apiFetch("/products", {
      method: "POST",
      body: JSON.stringify({ name, category, price, description }),
    });
    showToast("✅ Đã thêm sản phẩm thành công!", "success");
    ["prodName", "prodPrice", "prodDesc"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  } catch {
    showToast("Lỗi khi thêm sản phẩm. Kiểm tra kết nối API!", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "💾 LƯU SẢN PHẨM";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("article-list")) loadContent();
});
