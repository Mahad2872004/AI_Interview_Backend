const {GoogleGenAI}=require("@google/genai");
const {conceptExplainPrompt, questionAnswerPrompt}=require('../utils/prompts');

const ai=new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

//GENERATE interview questions and answers using gemini
//post api/ai/generate-questions
//access private
exports.generateInterviewQuestions=async (req,res)=>{
    try{
      const {role, experience, topicsToFocus, numberOfQuestions}=req.body;

      if(!role||!experience||!topicsToFocus||!numberOfQuestions){
        return res.status(400).json({message:"Missing required fields"});
      }

      const prompt=questionAnswerPrompt(role, experience, topicsToFocus,numberOfQuestions);;

      const response=await ai.models.generateContent({
        model:"gemini-2.0-flash-lite",
        contents:prompt,
      });

      let rawText=response.text;

      //clean it:remove ```json and ``` from begining and end
      const cleanedText=rawText.replace(/^```json\s*/,"")//remove statrting json
      .replace(/```$/,"")//remove ending ``
      .trim();//remove extra spaces

      //now safe to parse
      const data=JSON.parse(cleanedText);

      res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({
            message:"Failed to generate questions",
            error:error.message,
        });
    }
};

//generate explains a interview question
//post/api/ai/generate-explanation
//access private

exports.generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

   const cleanedText = rawText
  .replace(/^```json\s*/, "")
  .replace(/```$/, "")
  .replace(/[\r\n\t]/g, "") // 🔥 Remove newlines, tabs inside JSON
  .trim();

const data = JSON.parse(cleanedText);


    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};
