import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema (Database ka structure): Ye define karta hai ki database mein user ka data kaisa dikhega.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Data type text hoga
      required: [true, 'Name is required'], // Ye field zaroori hai (blank nahi chhod sakte)
      trim: true, // Aage peeche ke spaces ko automatically hata deta hai (" Nitesh " -> "Nitesh")
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'], // Regex: Sirf letters allowed hain
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ek email se sirf ek hi account ban sakta hai.
      lowercase: true, // Mongoose automatically email ko small letters mein convert kar dega.
      trim: true,
    },
    passwordHash: {
      type: String, // Password ko hash (encrypt) karke text format mein save karenge.
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Role ki value in dono mein se hi kuch ek ho sakti hai.
      default: 'user' // Agar kisi ne role nahi bataya account banate waqt, toh default 'user' manenge.
    }
  },
  {
    timestamps: true, // Ye line MongoDB ko bolti hai ki khud ba khud 'createdAt' aur 'updatedAt' fields add kar do, taaki pata chale account kab bana.
  }
);

// Method: Ye ek custom function hai jo har user object (database document) par kaam karega.
// Login karte waqt entered password ko database wale hashed password se compare karne ke liye ise use karte hain.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare() check karta hai ki normal text password aur hash aapas mein match karte hain ya nahi.
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Schema ko use karke ek Model banate hain. Is model (User) ka use karke hum MongoDB mein insert, find, ya delete karte hain.
const User = mongoose.model('User', userSchema);

export default User;
