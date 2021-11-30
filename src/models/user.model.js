const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { toJSON } = require('../plugin');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
      name: { 
        type: String, 
        required: true ,
        trim: true,
      },
      email: { 
        type: String, 
        required: true, 
        trim: true,
        unique: true 
      },
      active: { 
        type: Boolean,
        default: true 
      }, //false
      password: { 
        type: String, 
        required: true ,
        trim: true,
        private: true
      }
    },
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    }
);

userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({email});
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  try {
      const user = this;
      if (user.isModified('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
      }
      next();
    } catch (error) {
      throw new Error("Hashing failed", error);
    }
});
  
const User = mongoose.model("user", userSchema);
module.exports = User;