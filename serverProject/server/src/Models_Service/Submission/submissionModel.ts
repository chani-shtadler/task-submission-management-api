import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: string;
  studentId: string;
  githubLink: string;
  partner?: String;
  grade?: number;
  feedback?: string;
}
const SubmissionSchema = new Schema<ISubmission>({
  
  assignmentId: { type: String, required: true,ref: 'Assignment' },
  studentId: { type: String, required: true ,ref: 'User'},
  githubLink: { type: String, required: true },
    partner: { type: String ,ref: 'User',required: false},
    grade: { type: Number },
    feedback: { type: String },
    },
 { 

    
    toJSON: { 
      virtuals: true,
      }
      
});
SubmissionSchema.virtual('isGraded').get(function() {
  const isgraded: boolean = this.grade !=null;
  return isgraded;
});

  

export const SubmissionModel: Model<ISubmission> = mongoose.model<ISubmission>('Submission', SubmissionSchema);
