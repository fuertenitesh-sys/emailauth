import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// ================= SARE PRODUCTS GET KARNE KA CODE =================
export const getProducts = async (req, res) => {
  try {
    // Frontend URL se filters nikal rahe hain (jaise: ?category=shoes&search=nike&sort=price_asc)
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    
    // Default condition: Sirf wo products dikhao jo 'active' hain
    const query = { status: 'active' };
    
    // Agar frontend ne koi category filter lagaya hai toh:
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category; // Agar ID bheji hai toh direct set kar do
      } else {
        // Agar naam bheja hai (jaise 'Sports'), toh us naam ki category database mein dhoondho
        const cat = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (cat) query.category = cat._id;
        else query.category = new mongoose.Types.ObjectId(); // Agar galat naam hai, toh fake ID daalo taaki result empty aaye
      }
    }
    
    // Agar koi search text aaya hai, toh naam mein regex (partial match) laga ke dhoondho (case insensitive)
    if (search) {
      const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.name = { $regex: escapeRegex(search), $options: 'i' };
    }
    
    // Sorting (Naya pehle, sasta pehle ya mehnga pehle)
    let sortOption = { createdAt: -1 }; // Default: Sabse latest product pehle
    if (sort === 'price_asc') sortOption = { price: 1 }; // Sasta pehle
    if (sort === 'price_desc') sortOption = { price: -1 }; // Mehnga pehle
    if (sort === 'name_asc') sortOption = { name: 1 }; // A-Z 
    
    // Pata karo is filter ke baad total kitne products bache (pagination ke liye zaroori)
    const total = await Product.countDocuments(query);
    
    // Asli products dhoondh rahe hain
    const products = await Product.find(query)
      .populate('category', 'name') // Category ID ke badle uska naam bhi le aao
      .sort(sortOption)
      .skip((page - 1) * limit) // Kitne products skip karne hain (agar page 2 pe hain, toh pehle 12 chhod do)
      .limit(Number(limit)); // Ek page pe kitne dikhane hain
      
    // Result wapas frontend ko bhej do
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= EK PRODUCT KI DETAILS LENE KA CODE =================
export const getProductById = async (req, res) => {
  try {
    // URL se ID nikal kar database mein dhoondho
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' }); // Agar na mile toh 404 error
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= CATEGORY KE HISAAB SE PRODUCTS LENA =================
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId, status: 'active' })
      .populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= ADMIN KE LIYE SARE PRODUCTS LENA (ACTIVE AUR INACTIVE DONO) =================
export const getAllProducts = async (req, res) => {
  try {
    // Admin ko status filter lagane ki zaroorat nahi hai, usko sab dikhna chahiye
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= NAYA PRODUCT BANANA (ADMIN ONLY) =================
export const createProduct = async (req, res) => {
  try {
    // req.body mein naye product ka data hota hai
    const product = await Product.create(req.body);
    const populated = await product.populate('category', 'name'); // Banne ke baad category ki details bhi add karke bhejo
    res.status(201).json(populated); // 201 = Created Successfully
  } catch (error) {
    // Data validation check (agar form sahi se nahi bhara)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= PRODUCT KO UPDATE KARNA (ADMIN ONLY) =================
export const updateProduct = async (req, res) => {
  try {
    // findByIdAndUpdate() sidha dhoondta hai aur naya data replace kar deta hai. 
    // { new: true } ka matlab hai ki update hone ke BAAD wala naya data return karna.
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= PRODUCT KO DELETE KARNA (ADMIN ONLY) =================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id); // Seedhe delete karo
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
