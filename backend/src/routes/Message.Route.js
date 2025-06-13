import express, { Router } from "express"
import user from "../models/user.model.js";
import connectedUser from "../models/connectedUser.model.js"
import message from "../models/message.model.js";
import jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary.js";
import upload from "../lib/multer.js";
import streamifier from "streamifier";

const router = express.Router();


const protectedRoute = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized - no token provided" })


    try {

        const decorded = jwt.verify(token, process.env.JWT_SECRET);
        const User = await user.findById(decorded.userId).select("-Password");

        req.User = User;
        next();
    } catch (error) {
        res.status(401).json({ message: "Internal Server Error" })
        console.log("Error in Protected Route function : ", error)
    }
}



router.get("/get-messages/:UserId", protectedRoute, async (req, res) => {

    try {

        const UserId = req.User._id;
        const EachUserId = req.params.UserId
        console.log("UserId : " + UserId + "  : EachUserID : " + EachUserId);
        if (!UserId) return res.status(400).json({ message: "Invalid User Id" });

        const messages = await message.find({ $or: [{ SenderId: UserId, ReceiverId: EachUserId }, { SenderId: EachUserId, ReceiverId: UserId }] })

        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" });
        console.log("error in /get-messages/:UserId endpont : ", error);
    }


})


router.get("/get-users", protectedRoute, async (req, res) => {
    try {

        const UserId = req.User._id;
        if (!UserId) return res.status(400).json({ message: "Invalid User Id" });

        const users = await connectedUser.find({ $or: [{ HolderId: UserId }, { UserId }] })


        const DataUsers = await Promise.all(users.map(async (e) => {

            let EachUser;
            if (e.UserId == UserId) {
                EachUser = await user.findById(e.HolderId).select("-Password");
            } else {
                EachUser = await user.findById(e.UserId).select("-Password");

            }

            const m = await message.findOne({ $or: [{ SenderId: UserId, ReceiverId: e.UserId }, { SenderId: e.UserId, ReceiverId: UserId }] });


            let lastMessage = "";
            if (m) {

                if (m.SenderId == UserId) {
                    lastMessage = `You : ${m.Message == "" ? "Image" : m.Message}`
                }
                else if (m.SenderId == EachUser.UserId) {
                    lastMessage = `${EachUser.FullName} : ${m.Message == "" ? "Image" : m.Message}`
                }
            }

            return { ...EachUser.toObject(), IsPinned: e.IsPinned, lastMessage };

        }))
        if (!DataUsers || DataUsers.length == 0) return res.status(400).json({ messaeg: "No User Found" })

        res.status(200).json(DataUsers);

    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" })
        console.log("Error in /get-users/ end point : ", error);
    }

})

router.get("/get-user/:SearchText", protectedRoute, async (req, res) => {
    try {

        const { SearchText } = req.params;

        const UserId = req.User._id

        if (!SearchText) res.status(400).json({ message: "Invalid Search Text" });

        const users = await user.find({
            Username: { $regex: SearchText, $options: "i" },
            _id: { $ne: UserId }
        }).select("-Password");

        if (!users || users.length == 0) res.status(400).json({ message: "No User Found" })

        res.status(200).json(users);

    } catch (error) {
        res.status(400).json({ message: "Internal server error" })
        console.log("Error in /get-user/:SearchText endpoint : ", error);
    }
})

// router.get("/add-user/:UserId", protectedRoute, async (req, res) => {

//     try {

//         const HolderId = req.User._id;
//         const UserId = req.params.UserId;

//         const U = await connectedUser.countDocuments({ $or: [{ HolderId: HolderId, UserId: UserId }, { HolderId: UserId, UserId: HolderId }] })

//         if (U > 0) return res.status(500).json({ message: "User Already Added" })

//         const C = new connectedUser({
//             HolderId,
//             UserId,
//             IsPinned: false
//         })

//         const savedUser = await C.save();




//         let SpacificUser = await user.findById(UserId);

//         const m = await message.findOne({ $or: [{ SenderId: UserId, ReceiverId: HolderId }, { SenderId: HolderId, ReceiverId: UserId }] });

//          let lastMessage = "";
//             if (m) {

//                 if (m.SenderId == UserId) {
//                     lastMessage = `You : ${m.Message == "" ? "Image" : m.Message}`
//                 }
//                 else if (m.SenderId == EachUser.UserId) {
//                     lastMessage = `${SpacificUser.FullName} : ${m.Message == "" ? "Image" : m.Message}`
//                 }
//             }

//         const EndUser = {...SpacificUser.toObject() , IsPinned:savedUser.IsPinned , lastMessage}
//         res.status(200).json({ message: "User Added Successfully" , User:EndUser });
//     } catch (error) {
//         res.status(400).json({ message: "Internal Server Error" })
//         console.log("Error in /add-user/:UserId endpoint : ", error);
//     }

// })

router.get("/add-user/:UserId", protectedRoute, async (req, res) => {
    try {
        const HolderId = req.User._id;
        const UserId = req.params.UserId;

        // Check if connection already exists
        const exists = await connectedUser.countDocuments({
            $or: [
                { HolderId: HolderId, UserId: UserId },
                { HolderId: UserId, UserId: HolderId }
            ]
        });

        if (exists > 0) {
            return res.status(409).json({ message: "User already added" });
        }

        // Create connection
        const C = new connectedUser({
            HolderId,
            UserId,
            IsPinned: false
        });

        const savedUser = await C.save();

        // Get user details
        const specificUser = await user.findById(UserId).select("-Password");

        if (!specificUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get last message
        const m = await message.findOne({
            $or: [
                { SenderId: UserId, ReceiverId: HolderId },
                { SenderId: HolderId, ReceiverId: UserId }
            ]
        }).sort({ createdAt: -1 }); // Assuming you want the latest one

        let lastMessage = "";

        if (m) {
            const isImage = m.Message === "";
            if (m.SenderId.toString() === HolderId.toString()) {
                lastMessage = `You: ${isImage ? "Image" : m.Message}`;
            } else {
                lastMessage = `${specificUser.FullName}: ${isImage ? "Image" : m.Message}`;
            }
        }

        // Final response object
        const EndUser = {
            ...specificUser.toObject(),
            IsPinned: savedUser.IsPinned,
            lastMessage
        };
        res.status(200).json({ message: "User added successfully", User: EndUser });
    } catch (error) {
        console.error("Error in /add-user/:UserId endpoint:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




function streamUpload(fileBuffer) {
  return new Promise((resolve, reject) => {
    // Set a timeout (e.g., 15 seconds)
    const timeout = setTimeout(() => {
      reject({
        message: 'Request Timeout',
        http_code: 499,
        name: 'TimeoutError',
      });
    }, 60000);

    const stream = cloudinary.uploader.upload_stream((error, result) => {
      clearTimeout(timeout); 
      if (result) {
        resolve(result);
      } else {
        reject(error || {
          message: 'Unknown Cloudinary upload error',
          name: 'UploadError',
        });
      }
    });

   
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}


router.post("/send-message/:UserId", protectedRoute, upload.single("Image"), async (req, res) => {
    try {

        const ReceiverId = req.params.UserId;
        const SenderId = req.User._id;

        if (!ReceiverId || !SenderId) return res.status(401).json({ message: "Invalid Sender Or Receiver Id" });

        const { Message } = req.body;
        let PicturePath = "";

        if (req.file) {
            const UploadResponse = await streamUpload(req.file.buffer);
            PicturePath = UploadResponse.secure_url;
        }
        const SendAt = new Date();
        const messages = new message({
            SenderId,
            ReceiverId,
            Message,
            PicturePath,
            SendAt,
            SeenAt: "",
        })

        await messages.save();
    } catch (error) {
        console.log("Error in send-message end point : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.post("/upload-profile", protectedRoute, upload.single("Image"), async (req, res) => {
    try{

        const UserId = req.User._id;
        
        let PicturePath = "";
        
        if (req.file) {
            const UploadResponse = await streamUpload(req.file.buffer);
            PicturePath = UploadResponse.secure_url;
        }
        
        const newUser = await user.findByIdAndUpdate(UserId, { ProfilePic:PicturePath }, { new: true });
        
        res.status(200).json(newUser);
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.log("Error in /upload-profile end point : " , error);
    }

})

export default router;