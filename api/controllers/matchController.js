import User from "../models/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();
      // if the other user already liked us, it's a match
      if (likedUser.likes.includes(currentUser.id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser.id);

        await Promise.all([await currentUser.save(), await likedUser.save()]);

        // send notifcation if it is a match
        const connectedUsers = getConnectedUsers();
        const io = getIO();
        const likedUserSocketId = connectedUsers.get(likedUserId);
        if (likedUserSocketId) {
          io.to(likedUserSocketId).emit("newMatch", {
            _id: currentUser._id,
            name: currentUser.name,
            image: currentUser.image,
          });
        }

        const currentSocketId = connectedUsers.get(currentUser._id.toString());
        if (currentSocketId) {
          io.to(currentSocketId).emit("newMatch", {
            _id: likedUser._id,
            name: likedUser.name,
            image: likedUser.image,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (err) {
    console.log("error in swipe right controller ", err);
    res.status(500).json({ message: "internal server error" });
  }
};

export const swipteLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }
    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (err) {
    console.error("error in swipe left controller ", err);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );
    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (err) {
    console.log("error in getMatches ", err);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["males", "female"] }
              : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.log("error in getUserProfiles", err);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
