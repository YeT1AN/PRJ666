import supabase from "../config/supabaseClient.js";

export async function getTestGrades(userID) {

  const { data, error } = await supabase
  .from("TestGrades")
    .select(`
      Quizz1,
      Quizz2,
      Quizz3,
      Quizz4,
      Quizz5,
      Midterm,
      Final,
      AverageGrade,
      isPassed,
      Courses (CourseID, CourseName),
      Students (
        StudentID,
        UserID
      )
    `)
  .eq("Students.UserID", userID);

  if (error) {
    console.error("Failed to fetch test grades:", error);
    throw new Error("Failed to fetch test grades");
  }

  return data;
}

export async function getTestGradeByID(testGrade) {

}
// Add a new test grade
export async function addTestGrade(testGrade) {
  const { data, error } = await supabase
    .from("TestGrade")
    .insert([testGrade]);

  if (error) {
    console.error("Failed to add test grade:", error);
    throw new Error("Failed to add test grade");
  }

  return data;
}

// Update an existing test grade
export async function updateTestGrade(testGradeID, updatedData) {
  const { data, error } = await supabase
    .from("TestGrade")
    .update(updatedData)
    .eq("TestGradeID", testGradeID);

  if (error) {
    console.error("Failed to update test grade:", error);
    throw new Error("Failed to update test grade");
  }

  return data;
}

// Delete a test grade
export async function deleteTestGrade(testGradeID) {
  const { data, error } = await supabase
    .from("TestGrade")
    .delete()
    .eq("TestGradeID", testGradeID);

  if (error) {
    console.error("Failed to delete test grade:", error);
    throw new Error("Failed to delete test grade");
  }

  return data;
}

// Error handling function
function handleError(error, message) {
  console.error(error);
  throw new Error(message);
}
