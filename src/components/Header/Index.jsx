import "./Styles.css";
import { auth } from "../../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from "../../assets/user.svg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const logoutfnc = () => {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged Out Successfully !");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    const fetchUserName = async (user) => {
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);
      if (userData.exists()) {
        return userData.data().name;
      } else {
        return null;
      }
    };

    if (user) {
      fetchUserName(user).then((name) => {
        setUserName(name);
      });
    }
  }, [user]);

  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {user && (
        <div className="lg-wrapper">
          <h4 style={{ color: "white", fontWeight: "500", marginRight: "10px" }}>
            {user.displayName ? user.displayName : userName}
          </h4>
          {user.photoURL ? (
            <img src={user.photoURL} alt="user-img" className="user-logo" />
          ) : (
            <img src={userImg} alt="user-img" className="user-logo" />
          )}
          <p className="logo link" onClick={logoutfnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
