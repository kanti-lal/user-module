import { useEffect, useState } from "react";
import { User } from "./Dashboard";

const UsersList = ({ users }: { users: User[] }) => {
  const [sortBy, setSortBy] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.keys(user).every((key) =>
        String(user[key as keyof User])
          .toLowerCase()
          .includes(searchTerms[key as keyof User].toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [users, searchTerms]);

  const handleSort = (column: keyof User) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleColumnSearch = (column: keyof User, value: string) => {
    setSearchTerms({ ...searchTerms, [column]: value });
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const showPagination = filteredUsers.length > itemsPerPage;

  return (
    <div>
      <h2 className="text-center mb-3 mt-3">Users - List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                placeholder="ID Search..."
                value={searchTerms.id}
                onChange={(e) => handleColumnSearch("id", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="First Name Search..."
                value={searchTerms.firstName}
                onChange={(e) =>
                  handleColumnSearch("firstName", e.target.value)
                }
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Last Name Search..."
                value={searchTerms.lastName}
                onChange={(e) => handleColumnSearch("lastName", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Email Search..."
                value={searchTerms.email}
                onChange={(e) => handleColumnSearch("email", e.target.value)}
              />
            </th>
          </tr>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("firstName")}>
              First Name{" "}
              {sortBy === "firstName" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("lastName")}>
              Last Name{" "}
              {sortBy === "lastName" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("email")}>
              Email {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPagination && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handleChangePage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;
