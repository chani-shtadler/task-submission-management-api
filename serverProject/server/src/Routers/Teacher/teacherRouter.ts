import { AuthorizatTeacher } from "../../Middlewares/authorizationMid";
import express, { Request, Response, Router } from 'express';
import { authenticatUser } from "../../Middlewares/authenticationMid";
import { SubmissionService } from "../../Models_Service/Submission/submissionService";
import { AssignmentService } from "../../Models_Service/Assignment/assignmentService";
import { logger } from "../../Utils/Logger";

const assignmentService = new AssignmentService();
const submissionService = new SubmissionService();

export const teacherRouter : Router = express.Router();
teacherRouter.use(authenticatUser);
teacherRouter.use(AuthorizatTeacher);

teacherRouter.get('/submissions/:assignmentId', async (req: Request, res: Response) => {
    const { assignmentId } = req.params;

    try {
        logger.info(`Teacher is requesting submissions for assignment: ${assignmentId}`);


        const submissions = await submissionService.getSubmissionsByAssignment(assignmentId);

        if (!submissions || submissions.length === 0) {
            return res.status(200).json({ 
                message: "No submissions found for this assignment", 
                data: [] 
            });
        }


        res.status(200).json(submissions);

    } catch (err: any) {
        logger.error(`Router Error: Failed to get submissions: ${err.message}`);
        res.status(500).json({ 
            error: "Internal server error", 
            details: err.message 
        });
    }
});







teacherRouter.post('/assignments', async (req: Request, res: Response) => {

    const { Id, title, description, dueDate } = req.body;
    

    logger.debug(`the user is: ${(req as any).userId}`);

    try {

        const newAssignment = {
            Id: Id, 
            title,
            description,
            dueDate
        };

        const result = await assignmentService.createAssignment(newAssignment);
        
        logger.info(`Assignment created: ${result.Id}`);
        res.status(201).json(result);
    } catch (err: any) {
        logger.error(`Error creating assignment: ${err}`);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});


teacherRouter.put("/submissions/:studentId/:assignmentId", async (req : Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const assignmentId = req.params.assignmentId;
        const {grade,feedback} = req.body;
        const feedbackAndGrade = await submissionService.GradingAndFeedback(studentId,assignmentId,Number(grade),feedback);
        if(!feedbackAndGrade){
            res.status(400).json({message:"missing details"})
        }
        else{
        res.status(200).json(feedbackAndGrade);
        }
    }
    catch(err){
        res.status(500).json({error : "Internal server error"})
    }
});

teacherRouter.get("/stats/averages",async(req:Request,res:Response)=>{
    try{
    const studentId = req.body.studentId;
    const avg=await submissionService.average(studentId);
    if(avg==null){
        res.status(400).json({message:"missing details"})
    }
    else{
        res.status(200).send(avg);
    }
}
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
    
});


