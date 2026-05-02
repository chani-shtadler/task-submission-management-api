import { SubmissionModel } from "./submissionModel";
import { ISubmission } from "./submissionModel";
import { logger } from "../../Utils/Logger";

export class SubmissionService {


async createSubmission(assignmentId: string, studentId: string, githubLink: string, partnerId?: string): Promise<ISubmission> {
    try {
        const submission = new SubmissionModel({ assignmentId, studentId, githubLink, partner: partnerId });        
        await submission.save();
        logger.info(`New submission added for assignment ${assignmentId} by student ${studentId}`);
        return submission;
    } catch (error) {
        logger.error(`Error in createSubmission: ${error}`);
        throw error;
    }
}



async getSubmissionsByAssignment(assignmentId: string) {
    try {
        logger.info(`Fetching submissions for: ${assignmentId} with populate`);

        const submissions = await SubmissionModel.find({ assignmentId: assignmentId })
            .populate({
                path: 'assignmentId',   
                model: 'Assignment',    
                foreignField: 'Id',     
                localField: 'assignmentId' 
            });

        return submissions;
    } catch (err: any) {
        logger.error(`Error with populate: ${err.message}`);
        throw err;
    }
}

    async GradingAndFeedback(studentId: string, assignmentId: string,grade:number,feedback:string): Promise<string> {
        try {
            const submission = await SubmissionModel.findOne({ studentId, assignmentId });
            if (!submission) {
                logger.warn(`Submission not found for student ID: ${studentId} and assignment ID: ${assignmentId}`);
                return "Submission not found";
            }
            submission.grade = grade;
            submission.feedback = feedback;
            await submission.save();
            logger.info(`Grading and feedback updated for student ID: ${studentId} and assignment ID: ${assignmentId}`);
            return `Grade: ${submission.grade}, Feedback: ${submission.feedback}`;
        } catch (error) {
            logger.error(`Error retrieving grading and feedback for student ID ${studentId} and assignment ID ${assignmentId}: ${error}`);
            throw error;
        }
    }

    async seeSubmissions(studentId: string): Promise<ISubmission[]> {
        try {
            const submissions = await SubmissionModel.find({ $or: [{ studentId }, { partner: studentId }] })
                .populate('assignmentId', 'title description dueDate');
            logger.info(`Found ${submissions.length} submissions for student ${studentId}`);
            return submissions;
        } catch (error) {
            logger.error(`Error retrieving submissions for student ${studentId}: ${error}`);
            throw error;
        }
    } 


    async average(studentId: string): Promise<number | null> {
        const submissions: ISubmission[] = await SubmissionModel.find({ studentId });
        if (!submissions || submissions.length === 0) {
            logger.warn(`No submissions found for student ID: ${studentId}`);
            return null;
        }
        let count = 0;
        let sum = 0;
        submissions.forEach((submission: ISubmission) => {
            if (typeof submission.grade === 'number') {
                sum += submission.grade;
                count++;
            }
        });
        const average = count === 0 ? null : sum / count;
        logger.info(`the average is: ${average}`);
        return average;
    }
}