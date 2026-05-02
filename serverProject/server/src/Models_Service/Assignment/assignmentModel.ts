import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  Id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdDate: Date;
}
const AssignmentSchema = new Schema<IAssignment>({
  Id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  createdDate: {
        type: Date,
        default: Date.now,}
    },
 { 

    toJSON: { 
      virtuals: true,
      }
      
});
AssignmentSchema.virtual('isOpen').get(function() {
  const isopen: boolean = this.dueDate > new Date();
  return isopen;
});

  

export const AssignmentModel: Model<IAssignment> = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
