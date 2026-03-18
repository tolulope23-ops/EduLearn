import { StudentCourseService } from "../service/studentCourse.service.js";

export class StudentCourseController {
  /**
   * @param {StudentCourseService} studentCourseService
   */
  constructor(studentCourseService) {
    this.studentCourseService = studentCourseService;
  };

// Assign courses to a student
assignCourseToStudent = async(req, res, next) => {

    try {

        const {userId} = req.user;

        const { courseNames} = req.body;

        const result = await this.studentCourseService.assignCourseToStudent(
            courseNames,
            userId
        );

        return res.status(201).json({
            message: "Courses assigned successfully",
            data: result
        });

    } catch (error) {
      next(error);
    }
  }
}