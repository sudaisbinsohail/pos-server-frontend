// import ButtonFeild from "../components/ButtonFeild";
// import InputField from "../components/InputFeild";
// import PageHeading from "../components/PageHeading";
// import { useState } from "react";
// import { ToastContainer , toast} from "react-toastify";
// import { useNavigate } from "react-router-dom";


// export default function Login() {


//     const [Email, setEmail] = useState("");
//     const [Password, setPassword] = useState("");
//     const navigate = useNavigate();

//     function handleSubmit(e) {
//         e.preventDefault();
//         // Add login logic here
//         window.api.authUser(Email, Password).then((result) => {
//             if (result.success) {
//                 console.log(result)
//                 window.api.userSession(result.user);
               
//                 // console.log("User session set for:", result.user.dataValues);
                
//                 toast.success("Login successful!");
//                 // Redirect to dashboard or another page
//                  navigate("/dashboard");
//             } else {
                
//                 toast.error("Login failed: " + result.error);
//             }
//     }
// );
//     }


//     return (
//         <div className="flex justify-center h-screen items-center">

//             <ToastContainer />
//             <form onSubmit={handleSubmit} className="w-xl">
//                 <PageHeading title="Login" subtitle="Login to start selling" />
//                 <InputField
//                     label="Email"
//                     value={Email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <InputField
//                     label="Password"
//                     value={Password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />

//                 <ButtonFeild type="submit" label="Login" />
//             </form>

//         </div>
//     );
// }

import ButtonFeild from "../components/ButtonFeild";
import InputField from "../components/InputFeild";
import PageHeading from "../components/PageHeading";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";   // ← new thunk

export default function Login() {
  const [Email, setEmail]       = useState("");
  const [Password, setPassword] = useState("");

  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { loading, error } = useSelector((state) => state.users);

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await dispatch(loginUser({ email: Email, password: Password })).unwrap();

    if (result.success) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Login failed: " + result.error);
    }
  }

  return (
    <div className="flex justify-center h-screen items-center">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-xl">
        <PageHeading title="Login" subtitle="Login to start selling" />
        <InputField
          label="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ButtonFeild type="submit" label={loading ? "Logging in..." : "Login"} disabled={loading} />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}