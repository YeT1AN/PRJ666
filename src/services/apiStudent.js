import supabase from "../config/supabaseClient.js";

export async function getStudents() {
  const { data, error } = await supabase.from("Students").select(`
    *,
    Users (
      UserID,
      UserName,
      FirstName,
      LastName,
      Email,
      HomeAddress,
      DateOfBirth,
      PhoneNumber,
      UserNo
    ),
    Programs (
      ProgramName
    )
  `);

  // console.log("API getStudents", data);
  if (error) {
    console.error(error);
    throw new Error("Failed to load students");
  }

  return data;
}

// adding a student
export async function addStudent(student) {
  const { data, error } = await supabase.from("Students").insert([student]);

  if (error) {
    handleError(error, "Failed to add student");
  }

  return data;
}

// updating a student
export async function updateStudent(UserNo, updatedData) {
  const { data, error } = await supabase
    .from("Users")
    .update(updatedData)
    .eq("UserNo", UserNo);

  if (error) {
    console.error("Failed to update student:", error);
    throw error;
  }

  return data;
}

// deleting a student
export async function deleteStudent(StudentNo) {
  const { data, error } = await supabase
    .from("Students")
    .delete()
    .eq("StudentNo", StudentNo);

  if (error) {
    handleError(error, "Failed to delete student");
  }

  return data;
}

// // get student by student number
// export async function getStudentByStudentNo(userNo) {
//   const { data, error } = await supabase
//     .from("Students")
//     .select(
//       `*,
//       Users (
//         UserNo,
//         UserID,
//         UserName,
//         FirstName,
//         LastName,
//         Email,
//         HomeAddress,
//         DateOfBirth,
//         PhoneNumber,
//         RoleID,
//         Roles: Roles (
//           RoleID,
//           RoleName
//         )
//       )`
//     )
//     .eq("Users.UserNo", userNo)
//     .single();

//   if (error) {
//     console.error("Failed to fetch student:", error);
//     throw error;
//   }

//   return data;
// }
// get student by student number
export async function getStudentByStudentNo(userNo) {
  // get userID by userNo
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("UserNo", userNo)
    .single();

  if (userError) {
    console.error("Failed to fetch user:", userError);
    throw userError;
  }

  const userID = userData.UserID;
  // get student by userID
  const { data, error } = await supabase
    .from("Students")
    .select(
      `*,
      Users (
        UserNo,
        UserID,
        UserName,
        FirstName,
        LastName,
        Email,
        HomeAddress,
        DateOfBirth,
        PhoneNumber,
        RoleID,
        Roles: Roles (
          RoleID,
          RoleName
        )
      )`
    )
    .eq("UserID", userID)
    .single();

  if (error) {
    console.error("Failed to fetch student:", error);
    throw error;
  }

  return data;
}

// error handling
function handleError(error, message) {
  console.error(error);
  throw new Error(message);
}

// get student enrollments
export async function getStudentEnrollments(userNo) {
  // get userID by userNo
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("UserID")
    .eq("UserNo", userNo)
    .single();

  if (userError) {
    console.error("Failed to fetch user:", userError);
    throw userError;
  }

  const userID = userData.UserID;
  // get studentID by userID
  const { data: studentData, error: studentError } = await supabase
    .from("Students")
    .select("StudentID")
    .eq("UserID", userID)
    .single();

  if (studentError) {
    console.error("Failed to fetch student:", studentError);
    throw studentError;
  }

  const studentID = studentData.StudentID;
  // get enrollments by studentID
  const { data, error } = await supabase
    .from("Enrollments")
    .select(`
      CourseID,
      Courses (
        CourseName,
        StartDate,
        EndDate
      )
    `)
    .eq("StudentID", studentID);

  if (error) {
    console.error("Failed to fetch enrollments:", error);
    throw error;
  }

  return data.map((enrollment) => ({
    CourseID: enrollment.CourseID,
    CourseName: enrollment.Courses.CourseName,
    StartDate: enrollment.Courses.StartDate,
    EndDate: enrollment.Courses.EndDate,
  }));
}