import mongoose from 'mongoose'; // Mongoose import kar rahe hain, jo MongoDB database ke sath kaam karne (data dalne, nikalne) ko asaan banata hai.
import bcrypt from 'bcryptjs'; // Bcrypt import kar rahe hain. Ye password ko encrypt (hash) karne ke kaam aata hai taaki database mein password plain text mein save na ho.

// User ka Schema (Structure/Design) bana rahe hain ki database mein ek User ka data kaisa dikhega
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Naam ek text string hoga
      required: [true, 'Name is required'], // Ye dena zaruri hai, warna 'Name is required' error aayega
      trim: true, // Aage peeche ke extra spaces (jaise " Nitesh ") ko automatically hata dega
    },
    email: {
      type: String, // Email bhi ek text string hogi
      required: [true, 'Email is required'], // Ye bhi dena zaruri hai
      unique: true, // Ye sabse zaruri hai: Ek email se sirf 1 account ban sakta hai. Duplicate allow nahi karega.
      lowercase: true, // Chahe user Test@gmail.com daale, ye use automatically test@gmail.com kar dega jisse matching asaan ho.
      trim: true, // Extra spaces hata dega
    },
    passwordHash: {
      type: String, // Password ko hum plain nahi, 'hashed' format mein save karenge
      required: [true, 'Password is required'], // Password dena zaruri hai
    },
    isVerified: {
      type: Boolean,
      default: false, // Default false rahega jab tak OTP verify nahi hota
    },
    verificationOTP: {
      type: String, // Yahan 6 digit ka OTP save hoga temporarily
    },
    otpExpiresAt: {
      type: Date, // OTP kab expire hoga (e.g., 10 minutes from creation)
    }
  },
  {
    timestamps: true, // Jab bhi naya user banega (createdAt) ya update hoga (updatedAt), Mongoose khud time add kar dega.
  }
);

// Ye ek custom method (function) banaya hai jo har User ke sath jod diya jayega.
// Iska kaam hai user dwara dale gaye normal password ko database mein saved encrypted password se milana.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare check karta hai ki kya normal password (enteredPassword) aur hashed password (this.passwordHash) ek hi hain? Aur true/false deta hai.
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Upar banaye gaye structure (userSchema) ko 'User' naam ke Model mein convert kiya. Isse hum MongoDB collection (table) se interact kar payenge.
const User = mongoose.model('User', userSchema);

export default User; // Is User model ko export kar rahe hain taaki authController.js ise import karke data database mein save kar sake.
