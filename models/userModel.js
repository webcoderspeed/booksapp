import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  referredUser: {
    type: ObjectId,
    ref: 'User',
  },
  isPaymentMade: {
    type: Boolean,
    default: false,
  },
  totalEarning: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
}
);

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;