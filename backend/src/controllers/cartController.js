import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price discount images stock status');
    res.json(cart || { user: req.user._id, items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required' });
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) return res.status(400).json({ message: 'Insufficient stock' });
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'name price discount images stock status');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    const product = await Product.findById(item.product);
    if (quantity > product.stock) return res.status(400).json({ message: 'Insufficient stock' });
    item.quantity = quantity;
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'name price discount images stock status');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'name price discount images stock status');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
