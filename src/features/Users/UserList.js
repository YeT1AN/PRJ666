import React from "react";
import TableContainer from "../../ui/Layout/TableContainer";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import UserTable from "./UserTable";
import MainTitle from "../../ui/MainTitle/MainTitle";
import { sortUsersBy } from "../../services/apiUser";

function UserList() {
  const initialUserData = useLoaderData() || [];
  const [userData, setUserData] = useState(initialUserData);
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const totalPages = Math.ceil(userData.length / rowsPerPage);

  if (!userData || userData.length === 0) {
    return <p>No users found.</p>;
  }

  function handlePageChange(page) {
    setCurrPage(page);
  }

  function handleRowsPerPageChange(event) {
    setRowsPerPage(Number(event.target.value));
    setCurrPage(1);
  }

  async function handleSort(fieldName) {
    try {
      const sortedData = await sortUsersBy(fieldName);
      setUserData(sortedData);
    } catch (error) {
      console.error("Error sorting user table:", error);
    }
  }

  return (
    <>
      <MainTitle title="User List" />
      <TableContainer
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        onClickAddBtn={() => navigate("/users/new-user")}
        currPage={currPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onClickSort={handleSort}
      >
        {/*  */}
        <UserTable
          data={userData}
          rowsPerPage={rowsPerPage}
          currPage={currPage}
        />
      </TableContainer>
    </>
  );
}

export default UserList;
