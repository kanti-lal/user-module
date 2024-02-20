import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { addDoc, collection } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user: any = await signUp(email, password);
      updateProfile(user.user, {
        displayName: firstName + " " + lastName,
      });
      try {
        const docRef = await addDoc(collection(db, "users"), {
          firstName: firstName,
          lastName: lastName,
          email: email,
        });

        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
    finally {
      setLoading(false); 
    }
  };

  return (
    <div className="auth-container">
      <div className="p-4 box auth-form">
        <h2 className="mb-4 text-center">User Sign-Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicFname">
            <Form.Control
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLname">
            <Form.Control
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign up"}
            </Button>
          </div>
        </Form>
        <div className=" mt-3 text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
