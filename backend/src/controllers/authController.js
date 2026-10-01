import User from '../models/User.js'; // User model ko import kar rahe hain, jo database mein user ka data read/write karega.
import bcrypt from 'bcryptjs'; // Password ko secure (hash) karne ke liye bcryptjs use hota hai taaki database mein real password save na ho.
import jwt from 'jsonwebtoken'; // JWT (JSON Web Token) user ki login identity ko secure tarike se frontend tak bhejane ka ek token hai.

// Yeh function user ke login hone par ek secure token banata hai aur usko browser ki cookie mein save kar deta hai.
const generateToken = (res, userId) => {
  // jwt.sign() ek naya token banata hai jisme user ka ID chhupa hota hai. Iski validity 30 din (30d) set ki gayi hai.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Token ko response (res) ki cookie mein set kar rahe hain. 
  // httpOnly: true ka matlab hai ki koi hacker JavaScript se cookie chura nahi sakta (XSS attack se bachao).
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Production mein true hona chahiye taaki sirf HTTPS (secure connection) par hi cookie bheji jaye.
    sameSite: 'none', // Cross-origin requests ke liye, kyunki frontend aur backend alag domain/port par ho sakte hain.
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie ki life: 30 days (milliseconds mein calculate kiya hai)
  });
};

// ================= NAYA USER BANANE KA CODE (SIGNUP) =================
export const signup = async (req, res) => {
  // Frontend se bheja gaya data req.body mein hota hai. Hum name, email, aur password nikal rahe hain.
  const { name, email, password } = req.body;

  // Check kar rahe hain ki kahin user ne koi field khali toh nahi chhod di. Agar khali hai toh 400 Bad Request error bhejo.
  if (!name || !name.trim() || !email || !email.trim() || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Name check karne ka rule: Naam mein sirf alphabets (A-Z, a-z) aur spaces hone chahiye.
  const nameRegex = /^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Name must contain letters' });
  }

  try { 
    // Database mein check karo ki kya is email id se pehle se koi user register toh nahi hai.
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      // Agar email mil gaya, toh naya account nahi banega.
      return res.status(400).json({ message: 'User already exists' });
    }

    // Naya account banane se pehle password ko secure (hash) karna zaroori hai.
    // Salt ek random text hota hai jo password ko aur bhi secure banata hai.
    const salt = await bcrypt.genSalt(10); 
    const passwordHash = await bcrypt.hash(password, salt); // Original password ko hash mein badal diya.

    // Ab naye user ka data database mein save kar rahe hain.
    const user = await User.create({ 
      name, 
      email, 
      passwordHash // Dhyan rahe, humne asli password save nahi kiya, sirf uski hash value save ki hai.
    });

    if (user) {
      // User banne ke baad usko turant login (token generate) bhi karwa dete hain.
      generateToken(res, user._id);
      
      // Frontend ko success message aur user ki thodi si details bhej dete hain (asli password nahi bhejte).
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Registration successful!'
      });
    } else {
      // Agar kuch ajeeb error ki wajah se user create nahi hua.
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    // Agar database save karte waqt Mongoose ne koi validation error (jaise email ka format galat) pakda toh...
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Kisi aur type ka server error aane par 500 status (Server Error) bhejo.
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= LOGIN KARNE KA CODE (LOGIN) =================
export const login = async (req, res) => {
  // Frontend login form se email aur password bhejta hai.
  const { email, password } = req.body;

  // Validation: Email aur password dono aane chahiye.
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Sabse pehle database mein user ko uske email se dhoondho.
    const user = await User.findOne({ email });

    // Agar user mila AUR usne jo password likha hai wo database ke hashed password se match karta hai toh..
    // (Note: matchPassword ek custom function hai jo humne User model mein banaya hai)
    if (user && (await user.matchPassword(password))) {
      // Password sahi hai! Token generate karke cookie set kardo (User ab login ho gaya hai).
      generateToken(res, user._id);
      
      // Frontend ko user ki profile bhejo taaki waha UI mein naam dikh sake.
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 'user' ya 'admin' ka pata lagane ke liye
        message: 'Login successful'
      });
    } else {
      // Agar email ya password dono mein se kuch bhi galat hai, toh 401 (Unauthorized) error bhejo.
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= LOGOUT KARNE KA CODE =================
export const logout = (req, res) => {
  // Logout karna bahot simple hai: Browser ki cookie mein jo 'jwt' token hai, usko khali string ('') se replace kardo
  // aur uski expiry date past mein (Date(0)) set kardo, taaki browser turant us cookie ko delete kar de.
  res.cookie('jwt', '', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'none', 
    expires: new Date(0) 
  });
  res.json({ message: 'Logged out successfully' });
};

// ================= LOGGED-IN USER KI DETAILS LENE KA CODE =================
export const getMe = async (req, res) => {
  try {
    // req.user us middleware se aata hai jo check karta hai ki user logged in hai ya nahi.
    // Hum us user_id se poora data la rahe hain. .select('-passwordHash') ka matlab hai ki password database se nikal kar frontend ko galti se bhi na jaye.
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
      res.json(user); // User data frontend ko de diya
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
