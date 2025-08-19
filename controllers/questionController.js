const Question=require('../models/Question.js');
const Session=require('../models/Session.js');

//add additional questions to existing session
// post/api/question/add
//access private
exports.addQuestionsToSession=async (req,res)=>{
try{
    const {sessionId, questions}=req.body;
    if(!sessionId||!questions|| !Array.isArray(questions)){
        return res.status(400).json({message:"Invalid input data"});
    }
    const session=await Session.findById(sessionId);
    if(!session){
        return res.status(404).json({message:"Session not found"});
    }

    //create new questions
    const createQuestions=await Question.insertMany(
        questions.map((q)=>({
            session:sessionId,
            question:q.question,
            answer:q.answer,
        }))
    );

    //update session to include new question IDs
    session.questions.push(...createQuestions.map((q)=>q._id));
    await session.save();

    res.status(201).json(createQuestions);

}
catch(error){
    res.status(500).json({message:"Server Error"});
}
};

//pin or unpin question
//post/api/questions/:id/pin
//access private
exports.togglePinQuestion=async (req,res)=>{
    try{
        const question=await Question.findById(req.params.id);
        if(!question){
            return res.status(404).json({success:false,message:"Questions not found"});
        }

        question.isPinned=!question.isPinned;
        await question.save();

        res.status(200).json({success:true,question});
    }
    catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

//update a note for question
//post/api/questions/:id/note
//access private
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    question.note = note || "";
    await question.save();

    // ✅ Missing response added
    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
