const { Schema, model } = require("mongoose");
const { user } = require("../_enums/enums");

const User = new Schema(
  {
    username: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    assign_password: { type: String },
    roles: {
      type: [{ type: String, enum: Object.values(user.Roles) }],
      minItems: 1,
    },
    avatar: { type: String },
    tags: { type: Array },
    phone: { type: String },
    agency_id: { type: Schema.Types.ObjectId, ref: "Agency" },
    deleted: { type: Boolean, default: false },
    birthday: { type: Date, required: false },
    app_id: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = model("User", User);
