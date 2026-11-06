import { executeCode } from "../services/judge0Service.js";

export const runCode = async (req, res) => {
  try {
    const { language, sourceCode, stdin = "" } = req.body;

    const result = await executeCode({
      language,
      sourceCode,
      stdin,
    });

    return res.status(200).json({
      success: true,
      message: "Code execution completed.",
      result,
    });
  } catch (error) {
    console.error("Code execution error:", error.message);

    return res.status(502).json({
      success: false,
      message: error.message || "Code execution service is unavailable.",
    });
  }
};