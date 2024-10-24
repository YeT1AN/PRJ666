import generalStyles from "../../generalStyles.module.css";
import EditCourseForm from "../../components/Form/EditCourseForm";
import styles from "../Profile.module.css";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loader from "../../ui/Loader";
import EditContainer from "../../ui/Layout/EditContainer";
import MainTitle from "../../ui/MainTitle/MainTitle";
import {
  getCourseDetail,
  deleteCourse,
  updateCourse,
} from "../../services/apiCourse";
import Button from "../../components/Button/Button";
import { getTeachers } from "../../services/apiTeacher";
import formStyles from "../../components/Form/Form.module.css";

function CourseDetail() {
  const { courseNo, courseName } = useParams(); // Extract both courseNo and courseName
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const teacherData = await getTeachers();
        setTeachers(teacherData);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
       
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseDetail({ params: { ID: courseNo } });
        console.log(courseData);
        setCourse(courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseDetails();
  }, [courseNo]);

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse(course.CourseID);
      alert('Course deleted successfully!');
      navigate('/courses/course-list');
    } catch (err) {
      alert('Failed to delete the course: ' + err.message);
    }
  };

  const handleBack = () => {
    navigate('/courses/course-list');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleClickSave = async () => {
    try {
      // Create a copy of the course and exclude unwanted fields
      const { Programs, TeacherUser, Teachers, ...cleanedCourse } = course;
  
      console.log('Cleaned course data:', cleanedCourse); // Debugging line
  
      const res = await updateCourse(courseNo, cleanedCourse);
      setIsEditing(false);
  
      if (res) {
        alert('Course information updated successfully!');
        const courseData = await getCourseDetail({ params: { ID: courseNo } });
        setCourse(courseData); // Refresh course data
      } else {
        alert('Failed to update course information.');
      }
    } catch (error) {
      console.error('Error saving course data:', error);
      alert('An error occurred while saving the course data.');
    }
  };

  const handleEditBtn = (e) => {
    e.preventDefault();
    setIsEditing((prev) => !prev); // Toggle isEditing state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <MainTitle title="Course Detail" />
      {course ? (
        <EditContainer
          title={course.CourseName}
          isEdit={isEditing} // Use the isEditing state here
          onClickEdit={handleEditBtn}
          onClickSave={handleClickSave}
          onClickCancel={handleCancelEdit}
        >
          <div className={formStyles.sectionLayout}>
            <form>
              {/* Course ID */}
              <div className={formStyles.formRow}>
                <div className={formStyles.formItem}>
                  <label htmlFor="courseID" className={formStyles.formLabel}>
                    Course ID
                  </label>
                  <input
                    type="text"
                    id="courseID"
                    name="CourseID"
                    className={formStyles.formInput}
                    readOnly
                    disabled
                    value={course.CourseID}
                  />
                </div>
              </div>

              {/* Course Name and Description */}
              <div className={formStyles.formRow}>
                <div className={formStyles.formItem}>
                  <label htmlFor="courseName" className={formStyles.formLabel}>
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="CourseName"
                    className={formStyles.formInput}
                    disabled={!isEditing}
                    value={course.CourseName}
                    onChange={handleChange}
                  />
                </div>
                <div className={formStyles.formItem}>
                  <label htmlFor="description" className={formStyles.formLabel}>
                    Course Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="Description"
                    className={formStyles.formInput}
                    disabled={!isEditing}
                    value={course.Description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Start Date and End Date */}
              <div className={formStyles.formRow}>
                <div className={formStyles.formItem}>
                  <label htmlFor="startDate" className={formStyles.formLabel}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="StartDate"
                    className={formStyles.formInput}
                    disabled={!isEditing}
                    value={course.StartDate}
                    onChange={handleChange}
                  />
                </div>
                <div className={formStyles.formItem}>
                  <label htmlFor="endDate" className={formStyles.formLabel}>
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="EndDate"
                    className={formStyles.formInput}
                    disabled={!isEditing}
                    value={course.EndDate}
                    onChange={handleChange}
                  />
                </div>

                <div className={formStyles.formItem}>
                  <label htmlFor="time" className={formStyles.formLabel}>
                    Time
                  </label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    className={formStyles.formInput}
                    disabled={!isEditing}
                    value={course.Time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Teacher Selection */}
              <div className={formStyles.formRow}>
                <div className={formStyles.formItem}>
                  <label htmlFor="teacherName" className={formStyles.formLabel}>
                    Teacher Name
                  </label>
                  {isEditing ? (
                    teachers && teachers.length > 0 ? (
                      <select
                        value={course.TeacherID}
                        name="TeacherID"
                        onChange={handleChange}
                        required
                        className={formStyles.formInput}
                      >
                        {teachers.map((teacher) => (
                          <option
                            key={teacher.TeacherID}
                            value={teacher.TeacherID}
                          >
                            {teacher.Users.FirstName} {teacher.Users.LastName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p>No teachers found or loading...</p>
                    )
                  ) : (
                    <input
                      type="text"
                      id="teacherName"
                      name="TeacherName"
                      className={formStyles.formInput}
                      disabled={!isEditing}
                      value={`${course.TeacherUser.FirstName} ${course.TeacherUser.LastName}`}
                    />
                  )}
                </div>
              </div>

              {/* Program Details (Read-only) */}
              <div className={formStyles.formRow}>
                <div className={formStyles.formItem}>
                  <label htmlFor="programName" className={formStyles.formLabel}>
                    Program Name
                  </label>
                  <input
                    type="text"
                    id="programName"
                    name="ProgramName"
                    className={formStyles.formInput}
                    disabled
                    value={course.Programs.ProgramName}
                  />
                </div>
                <div className={formStyles.formItem}>
                  <label htmlFor="programCode" className={formStyles.formLabel}>
                    Program Code
                  </label>
                  <input
                    type="text"
                    id="programCode"
                    name="ProgramCode"
                    className={formStyles.formInput}
                    disabled
                    value={course.Programs.ProgramCode}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className={formStyles.buttons}>
            {!isEditing ? (
              <Button onClickBtn={handleEditBtn}>Edit Course</Button>
            ) : (
              <>
                <Button onClickBtn={handleClickSave}>Save</Button>
                <Button onClickBtn={handleCancelEdit}>Cancel</Button>
              </>
            )}
            <Button onClickBtn={handleDeleteCourse}>Delete Course</Button>
            <Button onClickBtn={handleBack}>Back To List</Button>
          </div>
        </EditContainer>
      ) : (
        <p>No course data found.</p>
      )}
    </div>
  );
}

export default CourseDetail;