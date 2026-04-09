import mongoose from "mongoose";

const pieceSchema = new mongoose.Schema({
    pieceId: Number,
    functionName: String,
    parameters: [String],
    sampleInput: mongoose.Schema.Types.Mixed,
    expectedBehavior: String
})

const problemSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    hiddenGoal: {type: String, required: true},
    length: {type: Number, required: true},
    pieces: [pieceSchema]
})

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;