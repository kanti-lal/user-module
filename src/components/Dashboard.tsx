import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import UsersList from "./UsersList";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ShimmerLoading from "./ShimmerLoading";
import Footer from "./Footer";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard = () => {
  const { logOut, user } = useUserAuth();
  const [globalSearchTerm, setGlobalSearchTerm] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error?.message);
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: User[] = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ ...(doc.data() as User), id: doc.id });
        });
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  React.useEffect(() => {
    const filtered = users.filter((user) =>
      Object.keys(user).some((key) =>
        String(user[key as keyof User])
          .toLowerCase()
          .includes(globalSearchTerm.toLowerCase())
      )
    );
    setFilteredUsers([...filtered]);
  }, [users, globalSearchTerm]);

  const handleGlobalSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchTerm(e.target.value);
  };

  return (
    <Container>
      <Row className="box">
        <Col>
          <div className="dashboard-header">
            <div>
              <h3 className="mb-2 text-capitalize">
                Welcome, {user && user.displayName}
              </h3>
              <div>Email : {user && user.email}</div>
            </div>
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="Global Search..."
                value={globalSearchTerm}
                onChange={handleGlobalSearchTerm}
              />
              {globalSearchTerm && (
                <div className="search-results">
                  {filteredUsers.map((user) => (
                    <div key={user.id}>
                      {user.firstName + " " + user.lastName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="logout-btn">
              <Button variant="primary" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      {users.length > 0 ? (
        <Row>
          <Col>
            <UsersList users={users} />
          </Col>
        </Row>
      ) : (
        <ShimmerLoading />
      )}
      <Footer />
    </Container>
  );
};

export default Dashboard;
