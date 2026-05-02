import express, {Request,Response,Router} from 'express';
import { AssignmentService } from '../../Models_Service/Assignment/assignmentService';
import { SubmissionService } from '../../Models_Service/Submission/submissionService';
import { authenticatUser } from '../../Middlewares/authenticationMid';
import { AuthService } from '../../Utils/Authentication';

export const studentRouter : Router = express.Router();

const assignmentService = new AssignmentService(); 
const submissionService = new SubmissionService();
studentRouter.use(authenticatUser);

studentRouter.get("/assignment",async(req:Request,res:Response)=>{
    try{
    const assignments = await assignmentService.openAssignments();
    if(assignments==null){
        res.status(400).json({message: "there is not open assignment"});
    }
    else{
        res.status(200).send(assignments);
    }
    }
    catch(error){
        res.status(500).json({error: "Internal server error"});
    }
});


studentRouter.post("/submissions",async(req:Request,res:Response)=>{
    try{
        const {assignmentId,githubLink,partnerId} = req.body;
        if(!assignmentId || !githubLink){
            return res.status(400).json({error: "Missing fields"});
        }
        const studentId = (req as any).userId;
        const submission = await submissionService.createSubmission(assignmentId,studentId,githubLink,partnerId);
        res.status(201).json({message: "submission created successfully",submission});
    }
    catch(error){
        res.status(500).json({error: "Internal server error"});
    }
});

studentRouter.get("/submissions/:me",async(req:Request,res:Response)=>{
    try{
        const studentId = req.params.me;
        const submissions = await submissionService.seeSubmissions(studentId);
        res.status(200).json({submissions});
    }
    catch(error){
        res.status(500).json({error: "Internal server error"});
    }
});


