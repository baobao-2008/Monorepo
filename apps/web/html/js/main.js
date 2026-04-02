const API = "http://localhost:3000";

function showToast(msg, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastOut .3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ─── API HELPER ─── */
async function api(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API error [${path}]:`, err);
    throw err;
  }
}

/* ─── SKELETON LOADER ─── */
function renderSkeletons(containerId, count = 2) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array(count)
    .fill('<div class="loading-skeleton skeleton-card"></div>')
    .join("");
}

let selectedProduct = null;

async function loadContent() {
  // ── Bài viết
  renderSkeletons("article-list", 2);
  try {
    const articles = await api("/articles");
    const articleDiv = document.getElementById("article-list");
    if (!articleDiv) return;

    if (!articles.length) {
      articleDiv.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📖</div>
          <p>Chưa có bài viết nào. Hãy đăng bài đầu tiên!</p>
        </div>`;
    } else {
      articleDiv.innerHTML = articles
        .map(
          (a, i) => `
        <div class="feature-card">
          <div class="feature-visual article-bg">
            <div class="visual-icon">📖</div>
            <div class="visual-badge clay">Vibe Media</div>
          </div>
          <div class="feature-info">
            <span class="tag">Góc Kể Chuyện #${String(i + 1).padStart(2, "0")}</span>
            <h3>${escHtml(a.title)}</h3>
            <p class="description">${escHtml(a.content)}</p>
            <div class="points-grid">
              <div class="point-item">Giá trị bản địa</div>
              <div class="point-item">Văn hóa truyền thống</div>
              <div class="point-item">Câu chuyện vùng cao</div>
              <div class="point-item">Lan tỏa cộng đồng</div>
            </div>
            <div class="card-actions">
              <button class="btn btn-secondary" onclick="alert('Đang mở trang chi tiết...')">
                Xem thêm →
              </button>
            </div>
          </div>
        </div>
      `,
        )
        .join("");
    }
  } catch {
    document.getElementById("article-list").innerHTML =
      `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Không thể tải bài viết.</p></div>`;
  }

  // ── Sản phẩm & Tour
  renderSkeletons("product-list", 2);
  try {
    const products = await api("/products");
    const productDiv = document.getElementById("product-list");
    if (!productDiv) return;

    if (!products.length) {
      productDiv.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🌿</div>
          <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
        </div>`;
    } else {
      productDiv.innerHTML = products
        .map(
          (p) => `
        <div class="feature-card">
          <div class="feature-visual product-bg">
            <div class="visual-icon">${categoryIcon(p.category)}</div>
            <div class="visual-badge moss">${escHtml(p.category)}</div>
          </div>
          <div class="feature-info">
            <span class="tag moss">Thương Mại & Trải Nghiệm</span>
            <h3>${escHtml(p.name)}</h3>
            <p class="description">${escHtml(p.description)}</p>
            <div class="price-tag">${Number(p.price).toLocaleString("vi-VN")} ₫</div>
            <div class="points-grid">
              <div class="point-item">Chất lượng VietGAP</div>
              <div class="point-item">Giao nhận toàn quốc</div>
              <div class="point-item">Tư vấn 24/7</div>
              <div class="point-item">Đổi trả 7 ngày</div>
            </div>
            <div class="card-actions">
              <button class="btn btn-moss" onclick="selectItem('${escHtml(p.name)}', ${p.id}, ${p.price})">
                🛒 Chọn mua ngay
              </button>
            </div>
          </div>
        </div>
      `,
        )
        .join("");
    }
  } catch {
    document.getElementById("product-list").innerHTML =
      `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Không thể tải sản phẩm. Kiểm tra kết nối API.</p></div>`;
  }
}

function categoryIcon(cat) {
  const map = { "Hoa quả": "🍑", "Du lịch": "🏔️", "Ngành dệt": "🧵" };
  return map[cat] || "🌿";
}

function escHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── CHỌN SẢN PHẨM ─── */
function selectItem(name, id, price) {
  selectedProduct = { id, price, name };
  const badge = document.getElementById("selected-item-display");
  if (badge) {
    badge.innerHTML = `
      <span>🛒 Đã chọn:</span>
      <span class="product-name">${escHtml(name)}</span>
      <span style="color:var(--clay);font-weight:700">${Number(price).toLocaleString("vi-VN")} ₫</span>
    `;
    badge.classList.remove("empty");
  }
  const orderSection = document.querySelector(".order-section");
  if (orderSection)
    orderSection.scrollIntoView({ behavior: "smooth", block: "center" });
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
  if (!/^0\d{9,10}$/.test(phone)) {
    showToast("Số điện thoại không hợp lệ!", "error");
    return;
  }

  const btn = document.querySelector(".btn-submit");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Đang gửi...";
  }

  try {
    await api("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        orderType: "PRODUCT",
        itemId: selectedProduct.id,
        totalAmount: selectedProduct.price,
      }),
    });
    showToast("🎉 Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.", "success");
    document.getElementById("custName").value = "";
    document.getElementById("custPhone").value = "";
    selectedProduct = null;
    const badge = document.getElementById("selected-item-display");
    if (badge) {
      badge.innerHTML = "Chưa chọn sản phẩm nào";
      badge.classList.add("empty");
    }
  } catch {
    showToast("Có lỗi xảy ra. Vui lòng thử lại!", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "XÁC NHẬN ĐẶT HÀNG NGAY";
    }
  }
}

let allOrders = [];

async function loadOrders() {
  const tbody = document.getElementById("admin-order-list");
  if (!tbody) return;
  tbody.innerHTML =
    '<tr><td colspan="6" class="table-empty">Đang tải...</td></tr>';

  try {
    allOrders = await api("/orders");
    renderOrders(allOrders);
  } catch {
    tbody.innerHTML =
      '<tr><td colspan="6" class="table-empty">⚠️ Không thể tải đơn hàng</td></tr>';
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById("admin-order-list");
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="table-empty">Chưa có đơn hàng nào</td></tr>';
    return;
  }
  tbody.innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td><b>${escHtml(o.customerName)}</b></td>
      <td>${escHtml(o.customerPhone)}</td>
      <td>#${o.itemId}</td>
      <td>${Number(o.totalAmount).toLocaleString("vi-VN")} ₫</td>
      <td><span class="status-badge pending">${escHtml(o.status || "PENDING")}</span></td>
      <td>${new Date(o.createdAt || Date.now()).toLocaleDateString("vi-VN")}</td>
    </tr>
  `,
    )
    .join("");
}

function searchOrders(query) {
  const q = query.toLowerCase();
  const filtered = allOrders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q),
  );
  renderOrders(filtered);
}

/* ============================================================
   PAGE: MANAGEMENT — Thêm bài viết & sản phẩm
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
    await api("/articles", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    showToast("✅ Đã đăng bài viết thành công!", "success");
    document.getElementById("artTitle").value = "";
    document.getElementById("artContent").value = "";
  } catch {
    showToast("Lỗi khi đăng bài. Thử lại!", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ĐĂNG BÀI VIẾT";
    }
  }
}

async function addProduct() {
  const name = document.getElementById("prodName")?.value?.trim();
  const category = document.getElementById("prodCategory")?.value;
  const price = parseFloat(document.getElementById("prodPrice")?.value);
  const description = document.getElementById("prodDesc")?.value?.trim();

  if (!name || !category || !price || !description) {
    showToast("Vui lòng điền đầy đủ thông tin sản phẩm!", "error");
    return;
  }
  if (isNaN(price) || price <= 0) {
    showToast("Giá tiền không hợp lệ!", "error");
    return;
  }

  const btn = document.getElementById("btnAddProduct");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Đang lưu...";
  }

  try {
    await api("/products", {
      method: "POST",
      body: JSON.stringify({ name, category, price, description }),
    });
    showToast("✅ Đã thêm sản phẩm thành công!", "success");
    ["prodName", "prodPrice", "prodDesc"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  } catch {
    showToast("Lỗi khi thêm sản phẩm. Thử lại!", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "LƯU SẢN PHẨM";
    }
  }
}

/* ─── INIT ─── */
document.addEventListener("DOMContentLoaded", () => {
  // Index page
  if (document.getElementById("article-list")) loadContent();

  // Admin page
  if (document.getElementById("admin-order-list")) loadOrders();

  // Search box
  const searchInput = document.getElementById("orderSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => searchOrders(e.target.value));
  }
});
