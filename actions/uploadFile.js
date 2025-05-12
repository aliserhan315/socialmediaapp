"use server";
import { cld } from "@/lib/cloudinary";

export const uploadFile = async (file, folder) => {
  try {
    // Upload image to Cloudinary (Promise-based version)
    const res = await cld.v2.uploader.upload(file, {
      folder: `socialhop/${folder}`,
      resource_type: "auto",
    });
    console.log("File uploaded successfully:", res);
    return res;
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to upload",
    };
  }
};

export const deleteFile = async (public_id) => {
  try {
    // Delete image from Cloudinary (Promise-based version)
    const res = await cld.v2.uploader.destroy(public_id);
    console.log("File deleted successfully:", res);
    return res;
  } catch (e) {
    console.error("Error deleting image:", e);
    return {
      error: "Failed to delete",
    };
  }
};
