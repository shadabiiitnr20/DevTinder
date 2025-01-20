import cloudinary from '../configs/cloudinary.js';
import { User } from '../models/user.model.js';

export const updateProfile = async (req, res) => {
  const { image, ...otherData } = req.body;
  try {
    let updatedData = otherData;
    //If users updates the image, handle that case
    if (image) {
      //Send the imgae in base64 format
      if (image.startsWith('data:image')) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadResponse.secure_url;
        } catch (error) {
          console.log('Error uploading inage', error);
          return res.status(400).json({
            success: false,
            message: 'Error uploading message',
          });
        }
      }
    }
    //Otherwise
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    );
    //Send the response
    res.status(201).json({
      success: true,
      message: 'Information updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.log('Error in updateProfile controller', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
