/* ===== EDIT THESE ===== */
const WHATSAPP_NUMBER = "2348184714390"; // country code + number, no "+" or spaces
const STORE = "Cavelle",
  CURRENCY = "₦";

const PRODUCTS = [
  // New Arrivals (8)
  { id: 1,  name: "Celeste Pendant Necklace", price: 375000, cat: "new", img: "resources/jewels/jewel-1.png", hot: true },
  { id: 2,  name: "Celine Link Cuff", price: 375000, cat: "new", img: "resources/jewels/jewel-2.jpeg", hot: true },
  { id: 3,  name: "Azure Crystal Studs", price: 375000, cat: "new", img: "resources/jewels/jewel-3.png", hot: true },
  { id: 4,  name: "Product Name", price: 375000, cat: "new", img: "resources/jewels/jewel-4.webp", hot: true },
  { id: 5,  name: "Pearl Essence Drops", price: 375000, cat: "new", img: "resources/jewels/jewel-5.jpg", hot: true },
  { id: 6,  name: "Celeste Silver Necklace", price: 375000, cat: "new", img: "resources/jewels/jewel-6.png", hot: true },
  { id: 7,  name: "Celeste Royal Necklace", price: 375000, cat: "new", img: "resources/jewels/jewel-7.jpeg", hot: true },
  { id: 8,  name: "Celeste Pendant Necklace", price: 375000, cat: "new", img: "resources/jewels/jewel-8.jpeg", hot: true },

  // Necklaces (4)
  { id: 9,  name: "Élise Pendant", price: 375000, cat: "necklaces", img: "resources/jewels/jewel-9.jpeg",  hot: false },
  { id: 10, name: "Celeste Diamond Necklace", price: 375000, cat: "necklaces", img: "resources/jewels/jewel-10.png", hot: false },
  { id: 11, name: "Celeste Royal Necklace", price: 375000, cat: "necklaces", img: "resources/jewels/jewel-7.jpeg", hot: false },
  { id: 12, name: "Celeste Pendant Necklace", price: 375000, cat: "necklaces", img: "resources/jewels/jewel-8.jpeg", hot: false },

  // Next to the promo banner (2)
  { id: 13, name: "Élise Sculpted Ring", price: 375000, cat: "promo", img: "resources/2151693702.jpg", hot: false },
  { id: 14, name: "Élise Ring Combo", price: 375000, cat: "promo", img: "resources/2151693759.jpg", hot: false }
];

let cart = {};
try {
  cart = JSON.parse(localStorage.getItem("cart") || "{}");
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {}
};
const $ = (id) => document.getElementById(id);
const money = (n) => CURRENCY + n.toLocaleString("en-NG");
const find = (id) => PRODUCTS.find((p) => p.id == id);

function updateCount() {
  const n = Object.values(cart).reduce((a, b) => a + b, 0);
  const el = $("cartCount");
  if (el) {
    el.textContent = n;
    el.hidden = !n;
  }
}
function media(p) {
  return p.img
    ? `<img src="${p.img}" alt="${p.name}">`
    : `<div class="ph"><i class="hgi hgi-stroke hgi-image-01"></i></div>`;
}
function card(p) {
  return `<article class="card"><div class="pimg">${media(p)}${p.hot ? '<span class="badge">HOT</span>' : ""}
  <button class="addbtn" data-add="${p.id}" aria-label="Add ${p.name} to cart"><i class="hgi hgi-stroke hgi-shopping-bag-01"></i></button></div>
  <h3>${p.name}</h3><p>${money(p.price)}</p></article>`;
}
function toast(msg) {
  let t = $("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("on"), 1400);
}

/* home */
const fill = (id, cat) => {
  const e = $(id);
  if (e)
    e.innerHTML = PRODUCTS.filter((p) => p.cat === cat)
      .map(card)
      .join("");
};
fill("newArrivals", "new");
fill("necklaceGrid", "necklaces");
fill("promoProducts", "promo");

/* cart page */
function renderCart() {
  if (!$("cartPage")) return;
  const ids = Object.keys(cart).filter((i) => cart[i] > 0 && find(i));
  $("cartFilled").hidden = !ids.length;
  $("cartEmpty").hidden = !!ids.length;
  $("items").innerHTML = ids
    .map((i) => {
      const p = find(i);
      return `<div class="row"><div class="thumb">${media(p)}</div>
    <h3>${p.name}</h3><span class="rp">${money(p.price)}</span>
    <div class="qtyw"><div class="qty"><button data-dec="${i}" aria-label="Decrease quantity">−</button><span>${cart[i]}</span><button data-inc="${i}" aria-label="Increase quantity">+</button></div>
    <button class="rm" data-rm="${i}">REMOVE</button></div></div>`;
    })
    .join("");
  $("total").textContent = money(
    ids.reduce((s, i) => s + find(i).price * cart[i], 0),
  );
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const d = b.dataset;
  if (d.add) {
    cart[d.add] = (cart[d.add] || 0) + 1;
    toast("Added to cart");
  } else if (d.inc) cart[d.inc]++;
  else if (d.dec) {
    cart[d.dec]--;
    if (cart[d.dec] <= 0) delete cart[d.dec];
  } else if (d.rm) delete cart[d.rm];
  else return;
  save();
  updateCount();
  renderCart();
});

const send = $("send");
if (send)
  send.onclick = () => {
    const name = $("name").value.trim(),
      addr = $("addr").value.trim(),
      note = $("note").value.trim();
    if (!name || !addr) {
      $("err").textContent =
        "Enter your full name and delivery address to continue.";
      (name ? $("addr") : $("name")).focus();
      return;
    }
    $("err").textContent = "";
    const ids = Object.keys(cart).filter((i) => cart[i] > 0 && find(i));
    const ref = "ORD-" + Date.now().toString(36).toUpperCase().slice(-6);
    const lines = ids
      .map(
        (i) =>
          `• ${cart[i]} × ${find(i).name} – ${money(find(i).price * cart[i])}`,
      )
      .join("\n");
    const total = money(ids.reduce((s, i) => s + find(i).price * cart[i], 0));
    const msg = `Hello ${STORE}, I’d like to place an order.\n\nOrder ${ref}\n${lines}\n\nTotal: ${total}\n\nName: ${name}\nDelivery address: ${addr}${note ? "\nNote: " + note : ""}\n\nPlease confirm availability, delivery fee and payment details.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    if (!window.open(url, "_blank", "noopener")) location.href = url;
  };
updateCount();
renderCart();
