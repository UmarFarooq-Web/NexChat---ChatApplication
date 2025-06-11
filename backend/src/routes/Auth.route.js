import express from "express"
import user from "../models/user.model.js";
import getToken from "../lib/jwt.js";
import jwt from "jsonwebtoken"
const router = express.Router();



const protectedRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - no token provided" })


    try {

        const decorded = jwt.verify(token, "123456789");
        const User = await user.findById(decorded.userId).select("-Password");

        req.User = User;
        next();
    } catch (error) {
        res.status(401).json({ message: "Internal Server Error" })
        console.log("Error in ProtectedRoute function : ", error)
    }
}




router.post("/login", async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) return res.status(400).json({ message: "Invalid Credidentials" })

    try {

        const users = await user.findOne({ Email, Password }).select("-Password");

        if (!users) return res.status(401).json({ message: "Incorrect Email or Password" });



        const token = getToken(users._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" })
    }
})

router.post("/signup", async (req, res) => {
    const { FullName, Username, Email, Password } = req.body;

    try {

        if (!FullName || !Username || !Email || !Password) return res.status(400).json({ message: "Invalid Credidentials!" });

        if (!Email.includes("@") || !Email.includes(".")) return res.status(400).json({ message: "Invalid Email Format" });

        if (Password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 digits long!" })


        const emails = await user.countDocuments({ Email });
        if (emails > 0) return res.status(409).json({ message: "Email Already Registered" })

        const User = new user({
            FullName,
            Username,
            Email,
            Password,
            ProfilePic: ""
        })

        await User.save();
        const { Password: _, ...userWithoutPassword } = User.toObject();
        res.status(201).json(userWithoutPassword)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" })
        console.log("Error in /signup end point! : " + error);
    }
})


router.get("/check-username/:Username", async (req, res) => {
    const { Username } = req.params;

    if (!Username) return res.status(401).json({ message: "Invalid Username" })

    try {

        const users = await user.countDocuments({ Username });
        console.log("eefemfef" + users + Username)
        if (users > 0) { return res.status(409).json({ message: "Username Already Taken!" }) }

        res.status(200).json({ message: "Username Available!" })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log("Error in /check-username/:Username endpoint! : ", error);
    }
})

router.get("/check", protectedRoute, async (req, res) => {
    try {
        res.status(200).json(req.User);

    } catch (error) {
        res.status(401).json({ message: "Internal Server Error" })
        console.log("Error in /check endpont : ", error)
    }
})


router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,   
    sameSite: "lax", 
    path: "/",       
  });

  res.status(200).json({ message: "Logged out successfully" });
});




export default router;