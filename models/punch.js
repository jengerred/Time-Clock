import mongoose, { Schema, models } from "mongoose";
import User from "./user";


const punchSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['in', 'out'],
  },
});

const Punch = models.Punch || mongoose.model('Punch', punchSchema);
export default Punch;