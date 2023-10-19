const mongoose = require('mongoose')

const configureDB = async (req,res)=>{
    try{

        const db = await mongoose.connect(`${process.env.DBURL}/${process.env.DB_NAME}`)

        console.log("connected to the database succesfully")

    }catch(e){

        console.log('error in connecting database',e)

    }
}

module.exports = configureDB