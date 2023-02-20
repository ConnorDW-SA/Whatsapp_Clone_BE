import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: false }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    const password = await bcrypt.hash(user.password, 10);
    user.password = password;
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user.createdAt;
  delete user.updatedAt;
  return user;
};

UserSchema.static("findByCredentials", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
});

export default mongoose.model("User", UserSchema);
