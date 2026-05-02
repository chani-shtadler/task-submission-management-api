import { AssignmentModel, IAssignment } from "./assignmentModel";
import { logger } from "../../Utils/Logger";

export class AssignmentService {

async createAssignment(assignmentData: any) {
    try {
        const assignment = new AssignmentModel(assignmentData);
        return await assignment.save();
    } catch (err) {
        throw err; 
    }
}


    async openAssignments(): Promise<(IAssignment & { isOpen?: boolean })[] | null> {
    try{
    const assignments: (IAssignment & { isOpen?: boolean })[] | null = await AssignmentModel.find().lean();

    assignments?.forEach(assignment => {
        if (assignment.isOpen) {
            logger.info(`Open assignment found with ID: ${assignment._id}`);
        }        
    });
    return assignments;
    }
    catch(error){
        logger.error(`there is not open assignment`);
        throw error;
    }
}
}

   