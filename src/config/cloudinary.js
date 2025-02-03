const cloudinary =require('cloudinary').v2

require('dotenv').config()

exports.connect = () => {
    try
    {
        cloudinary.config({
            cloud_name:process.env.CLOUDE_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
        })
        console.log("connect")

    }
    catch(error){

        console.error(error)

    }
}