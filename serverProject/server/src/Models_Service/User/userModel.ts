import mongoose, {Schema , Model} from 'mongoose';


export interface IUser {
  _id: string; // userId
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
}
const UserSchema = new Schema({
  _id: {
    type: String,
    required: true,// 
    alias: 'userId' //
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true,unique: true},
  role: { type: String, enum: ['teacher', 'student'],lowercase: true,
  trim: true, required: true },
    },
 { 
    toJSON: { 
      virtuals: true,
    }
});


export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
