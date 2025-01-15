import { User } from '../models/user.model.js';

export const swipeRight = async (req, res) => {
  const { _id } = req.user;
  const { likedUserId } = req.params;
  try {
    const currentUser = await User.findById(_id);
    const likedUser = await User.findById(likedUserId);
    //If the liked user does not exist
    if (!likedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    //
    if (currentUser._id === likedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot right swipe own Id',
      });
    }
    //
    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes[likedUserId];
      await currentUser.save();

      //If it is a match
      if (likedUser.likes.includes(currentUser._id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser._id);
        await Promise.all([await currentUser.save(), await likedUser.save()]);
      }

      //TODO sent notification if it is a match
    }

    res.status(200).json({
      success: true,
      message: 'Like Successful',
      user: currentUser,
    });
  } catch (error) {
    console.log('Error in like controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const swipeLeft = async (req, res) => {
  const { _id } = req.user;
  const { dislikedUserId } = req.params;
  try {
    const currentUser = await User.findById(_id);
    const dislikedUser = await User.findById(dislikedUserId);
    //
    if (!dislikedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    //
    if (currentUser._id === dislikedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot left swipe own Id',
      });
    }
    //
    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes[dislikedUserId];
      await currentUser.save();
    }
    //
    res.status(200).json({
      success: true,
      message: 'Dislike Successful',
      user: currentUser,
    });
  } catch (error) {
    console.log('Error in dislike controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getMatches = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).populate('matches', 'name image');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Matches fetched successfully',
      matches: user.matches,
    });
  } catch (error) {
    console.log('Error in getMatches controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getUsersProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    const currentUser = await User.findById(_id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Cannot find user',
      });
    }
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } }, //Id => not equal to current user id
        { _id: { $nin: currentUser.matches } }, //Id => not in current user matches
        { _id: { $nin: currentUser.likes } }, //Id => not in current user likes
        { _id: { $nin: currentUser.dislikes } }, //Id => not in current user dislikes
        {
          //Filter by gender, if the current user has genederPreference as both include both
          //otherwise include only users with genders of currentUser.genderPreference
          gender:
            currentUser.genderPreference === 'both'
              ? { $in: ['male, female'] }
              : currentUser.genderPreference,
        },
        {
          //Also have to filter out by genderPreference of other users
          //So if genderPreference of the other user includes currentUser.gender or both
          //then filter out those users
          genderPreference: { $in: [currentUser.gender, 'both'] },
        },
      ],
    });
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      matches: users,
    });
  } catch (error) {
    console.log('Error in getUserProfile controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
