// Import library Supabase dari CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inisialisasi Supabase Client
const supabaseUrl = "https://yftsstixtmudnsvmtonb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdHNzdGl4dG11ZG5zdm10b25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NTE2MjIsImV4cCI6MjA0OTMyNzYyMn0.rMUpoRn6zLnHH8PqKS4LPvkeBrNeK2cQOzfCOq6ezto";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_PASSWORD = "iwan23";

  const loginContainer = document.getElementById("loginContainer");
  const passwordInput = document.getElementById("passwordInput");
  const loginForm = document.getElementById("loginForm");
  const adminForm = document.getElementById("adminForm");
  const productFormContainer = document.querySelector(".product-form-container");
  const productForm = document.getElementById("productForm");
  const productListContainer = document.getElementById("productListContainer");

  // Fungsi validasi password
  function checkPassword(event) {
    event.preventDefault(); // Mencegah form reload halaman
    const enteredPassword = passwordInput.value;

    if (enteredPassword === ADMIN_PASSWORD) {
      loginContainer.style.display = "none";
      adminForm.style.display = "block";
      productFormContainer.style.display = "block";
      fetchProducts(); // Muat daftar produk saat admin berhasil login
    } else {
      alert("Password salah! Coba lagi.");
    }
  }

  // Tambahkan event listener untuk form submit
  loginForm.addEventListener("submit", checkPassword);

  // Fungsi membersihkan nama file
  function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  }

  // Fungsi upload gambar ke Supabase
  async function uploadImage(file) {
    const sanitizedFileName = sanitizeFileName(file.name);
    const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
    try {
      const { data, error } = await supabase.storage
        .from("products")
        .upload(`images/${uniqueFileName}`, file);

      if (error) {
        console.error("Error Supabase:", error.message);
        throw new Error("Gagal mengunggah gambar: " + error.message);
      }

      const { data: publicData } = supabase.storage
        .from("products")
        .getPublicUrl(`images/${uniqueFileName}`);

      return publicData.publicUrl;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }

  // Fungsi untuk fetch produk dari database
  async function fetchProducts() {
    const { data: products, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Gagal memuat produk:", error.message);
      return;
    }

    renderProducts(products);
  }

  function renderProducts(products) {
    const table = `
      <table id="productList">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product) => `
            <tr>
              <td>${product.name}</td>
              <td>Rp ${product.price}</td>
              <td><img src="${product.image_url}" alt="${product.name}" class="product-image"></td>
              <td><a href="${product.link}" target="_blank">here</a></td>
              <td><button class="delete-product" data-id="${product.id}">delete</button></td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
    productListContainer.innerHTML = table;
  
    // Pasang event listener untuk tombol hapus
    setupDeleteButtons();
  }
  

  // Fungsi untuk hapus produk
  async function deleteProduct(productId) {
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      alert("Gagal menghapus produk.");
      console.error(error);
      return;
    }

    alert("Produk berhasil dihapus.");
    fetchProducts(); // Refresh daftar produk
  }

  // Event listener untuk tombol hapus
  function setupDeleteButtons() {
    document.querySelectorAll(".delete-product").forEach((button) =>
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus produk ini?");
        if (confirmDelete) {
          deleteProduct(productId);
        }
      })
    );
  }



  // Fungsi submit untuk menambah produk (default)
  async function handleProductSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").files[0];
    const link = document.getElementById("productLink").value;

    if (!name || !price || !image || !link) {
      alert("Semua field harus diisi!");
      return;
    }

    const imageUrl = await uploadImage(image);

    const { error } = await supabase.from("products").insert([{ name, price, image_url: imageUrl, link }]);
    if (error) {
      alert("Gagal menambahkan produk.");
      return;
    }

    alert("Produk berhasil ditambahkan!");
    productForm.reset();
    fetchProducts(); // Refresh daftar produk
  }

  // Pasang event listener untuk tambah produk
  productForm.addEventListener("submit", handleProductSubmit);
});
