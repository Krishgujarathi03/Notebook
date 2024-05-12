import { connect } from "mongoose";

// mongodb+srv://Krish:<password>@cluster0.hsd5l4g.mongodb.net/
const connectToMongo = async () => {
  try {
    await connect(
      "mongodb+srv://Krish:Krish03*@cluster0.hsd5l4g.mongodb.net/Notebook"
    );
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
