
import { useState } from "react";
import Input from "../Input/index"
import Button from "../Button/index"
import "./Styles.css"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";


function SignupSigninComponent() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  function signupWithEmail() {
    setLoading(true)
    console.log("Name : ", name);
    console.log("Email : ", email);
    console.log("Password : ", password);
    console.log("Confirm Password : ", confirmPassword);

    //Authenticate the user, or basically creare new account using email and password
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User >>>", user);
            toast.success("User Create")
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
            // create a doc with user id as the following id 
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false)
          });
      } else {
        toast.error("Password and Confirm Password must be same")
        setLoading(false)
      }
    } else {
      toast.error("All fields are mandatory")
      setLoading(false)
    }
  }

  function loginWithEmail() {
    setLoading(true)
    console.log("Email : ", email);
    console.log("Password : ", password);
    if (email != "" && password != "") {
      //Authenticate the user, or basically creare new account using email and password
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("User >>>", user);
          toast.success("User Logged In!")
          setEmail("");
          setPassword("");
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    }
    else {
      toast.error("All fields are mandatory")
      setLoading(false)
    }
  }

  async function createDoc(user) {
    // Make sure that the doc with the uid doesn't exist !
    // Create a doc.
    setLoading(true)
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    const createdAt = new Date();

    if (user.displayName == null) {
      user.displayName = name;
    }

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: createdAt,
        });
        toast.success("Doc Created !")
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc Already Exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User >> ", user);
        setLoading(false);
        toast.success("User Authenticated!");
        createDoc(user);
        navigate("/dashboard");

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
        // ...
      });
  }

  return (
    <>
      {
        loginForm ? <div className="login-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input type={"email"} label={"Email"} state={email} setState={setEmail} placeholder={"JohnDeu@gmail.com"} />
            <Input type={"password"} label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} />
            <Button text={loading ? "Loading..." : "Login Using Email and Password"} onClick={loginWithEmail} disabled={loading} />
            <p className="p-login">or</p>
            <Button text={loading ? "Loading..." : "Login Using Google"} blue={true} onClick={googleAuth} />
            <p className="p-login" style={{ cursor: "pointer" }} onClick={() => setLoginForm(!loginForm)}>Or Don&apos;t have an Account Already ? Click here </p>
          </form>
        </div> : <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input type={"text"} label={"Full Name"} state={name} setState={setName} placeholder={"John Deu"} />
            <Input type={"email"} label={"Email"} state={email} setState={setEmail} placeholder={"JohnDeu@gmail.com"} />
            <Input type={"password"} label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"} />
            <Input type={"password"} label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Example@123"} />
            <Button text={loading ? "Loading..." : "Signup Using Email and Password"} onClick={signupWithEmail} disabled={loading} />
            <p className="p-login">or</p>
            <Button text={loading ? "Loading..." : "Signup Using Google"} blue={true} onClick={googleAuth} />
            <p className="p-login" style={{ cursor: "pointer" }} onClick={() => setLoginForm(!loginForm)}>Or have an Account Already ? Click here </p>
          </form>
        </div>
      }

    </>
  )
}

export default SignupSigninComponent