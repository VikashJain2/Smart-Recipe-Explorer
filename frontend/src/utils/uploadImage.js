import { uploadApi } from "../services/api";

const uploadImage = async(file)=>{
    try {
        console.log("uploading file:", file);
        const formData = new FormData();
        formData.append('image', file)
        const response = await uploadApi.uploadImage(formData);
        return response.data.secure_url
    } catch (error) {
         console.log(error);
    }
}

export default uploadImage;