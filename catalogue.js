// Import library Supabase dari CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inisialisasi Supabase Client
const supabaseUrl = "https://yftsstixtmudnsvmtonb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdHNzdGl4dG11ZG5zdm10b25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NTE2MjIsImV4cCI6MjA0OTMyNzYyMn0.rMUpoRn6zLnHH8PqKS4LPvkeBrNeK2cQOzfCOq6ezto";

const supabase = createClient(supabaseUrl, supabaseKey);

// Variabel global untuk menyimpan data produk
let cachedProducts = [];

// Fungsi untuk mencari produk berdasarkan nama
function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();

  // Filter produk yang sesuai dengan pencarian
  const filteredProducts = cachedProducts.filter((product) =>
    product.name.toLowerCase().includes(input)
  );

  // Tampilkan hasil pencarian
  renderProducts(filteredProducts);
}
// Ekspos fungsi searchProducts ke global scope
window.searchProducts = searchProducts;

// Fungsi untuk merender produk ke halaman
function renderProducts(products) {
  const productContainer = document.querySelector(".catalogue");

  // Bersihkan kontainer sebelum menampilkan produk baru
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = "<p>Tidak ada produk yang ditemukan.</p>";
    return;
  }

  // Tampilkan produk ke halaman
  products.forEach((product) => {
    productContainer.innerHTML += `
      <div class="product-card">
        <img src="${product.image_url}" alt="${product.name}">
        <div class="product-details">
          <h3>${product.name}</h3>
          <p class="price">Rp${product.price}</p>
          <a href="${product.link}" target="_blank" class="shopee-link">Beli di Shopee</a>
        </div>
      </div>
    `;
  });
}

// Fungsi untuk memuat produk dari Supabase dan menyimpannya di cache
async function fetchProducts() {
  try {
    // Ambil data dari tabel 'products'
    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;

    console.log("Produk yang diambil:", products);

    // Simpan produk ke variabel global
    cachedProducts = products;

    // Tampilkan semua produk ke halaman
    renderProducts(cachedProducts);
  } catch (error) {
    console.error("Gagal memuat produk:", error.message);
  }
}

// Panggil fungsi fetchProducts saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", fetchProducts);
