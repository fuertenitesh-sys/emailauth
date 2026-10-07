export const adminCache = {
  users: JSON.parse(localStorage.getItem('admin_users')) || null,
  stats: JSON.parse(localStorage.getItem('admin_stats')) || null,
  orders: JSON.parse(localStorage.getItem('admin_orders')) || null,
  recentOrders: JSON.parse(localStorage.getItem('admin_recentOrders')) || null,
  products: JSON.parse(localStorage.getItem('admin_products')) || null,
  categories: JSON.parse(localStorage.getItem('admin_categories')) || null,
  subscribers: JSON.parse(localStorage.getItem('admin_subscribers')) || null
};

export const setAdminCache = (key, data) => {
  adminCache[key] = data;
  localStorage.setItem(`admin_${key}`, JSON.stringify(data));
};
