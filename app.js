let db;

async function setupSupabase() {
  const response = await fetch("/config")
  const config = await response.json();

  db = supabase.createClient(config.supabaseUrl, config.supabaseKey);

  loadProducts();
}

const productList = document.getElementById("productList");

async function loadProducts() {
  const { data, error } = await db
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("Error loading products");
    return;
  }

  productList.innerHTML = "";

  data.forEach((product) => {
    productList.innerHTML += `
      <div class="product">
        <h3>${product.name}</h3>
        <p>${product.description || ""}</p>
        <p>Price: PHP ${product.price / 100}</p>
        <p>Stock: ${product.stock}</p>

        <button onclick='editProduct(${JSON.stringify(product)})'>Edit</button>
        <button onclick="deleteProduct('${product.id}')">Delete</button>
        <button onclick='buyProduct(${JSON.stringify(product)})'>Buy</button>
      </div>
    `;
  });
}

async function saveProduct() {
  const id = document.getElementById("productId").value;

  const product = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value) * 100,
    stock: Number(document.getElementById("stock").value),
  };

  let result;

  if (id) {
    result = await db.from("products").update(product).eq("id", id);
  } else {
    result = await db.from("products").insert(product);
  }

  if (result.error) {
    console.error(result.error);
    alert("Error saving product");
    return;
  }

  clearForm();
  loadProducts();
}

function editProduct(product) {
  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description || "";
  document.getElementById("price").value = product.price / 100;
  document.getElementById("stock").value = product.stock;
}

async function deleteProduct(id) {
  const { error } = await db.from("products").delete().eq("id", id);

  if (error) {
    console.error(error);
    alert("Error deleting product");
    return;
  }

  loadProducts();
}

function clearForm() {
  document.getElementById("productId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
}

async function buyProduct(product) {
  try {
    const response = await fetch("/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product, frontendOrigin: window.location.origin }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      alert(result.errors?.[0]?.detail || "Could not create checkout.");
      return;
    }

    window.location.href = result.data.attributes.checkout_url;
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Cannot connect to payment server. Make sure node server.js is running.");
  }
}

setupSupabase();