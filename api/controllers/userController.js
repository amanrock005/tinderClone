import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;
    let updatedData = otherData;

    if (image) {
      if (image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadResponse.secure_url;
        } catch (err) {
          console.log("error uploading image", err);
          return res.status(400).json({
            success: false,
            message: "error uploading image",
          });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      usre: updatedUser,
    });
  } catch (err) {
    console.log("error in updateprofile controller ", err);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
