const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getJudge0Config = () => {
  const apiUrl = process.env.JUDGE0_API_URL?.trim().replace(/\/+$/, "");
  const apiKey = process.env.JUDGE0_API_KEY?.trim();

  if (!apiUrl) {
    throw new Error(
      "Judge0 API URL is not configured. Check server/.env"
    );
  }

  return { apiUrl, apiKey };
};

const getHeaders = (apiKey) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["X-Auth-Token"] = apiKey;
  }

  return headers;
};

export const executeCode = async ({
  sourceCode,
  language,
  stdin = "",
}) => {
  const { apiUrl, apiKey } = getJudge0Config();

  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error("Unsupported programming language.");
  }

  const headers = getHeaders(apiKey);

  // Create submission.
  const submissionResponse = await fetch(
    `${apiUrl}/submissions?base64_encoded=false&wait=false`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        cpu_time_limit: 2,
        cpu_extra_time: 1,
        wall_time_limit: 5,
        memory_limit: 128000,
      }),
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!submissionResponse.ok) {
    const errorText = await submissionResponse.text();

    throw new Error(
      `Judge0 submission failed (${submissionResponse.status}): ${errorText}`
    );
  }

  const submission = await submissionResponse.json();

  if (!submission.token) {
    throw new Error("Judge0 did not return a submission token.");
  }

  // Poll for execution result.
  for (let attempt = 0; attempt < 15; attempt++) {
    await sleep(1000);

    const resultResponse = await fetch(
      `${apiUrl}/submissions/${submission.token}?base64_encoded=false`,
      {
        headers,
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!resultResponse.ok) {
      const errorText = await resultResponse.text();

      throw new Error(
        `Judge0 result request failed (${resultResponse.status}): ${errorText}`
      );
    }

    const result = await resultResponse.json();

    // Status 1 = In Queue
    // Status 2 = Processing
    if (result.status?.id > 2) {
      return {
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
        compileOutput: result.compile_output ?? "",
        message: result.message ?? "",
        status: result.status?.description ?? "Unknown",
        statusId: result.status?.id ?? null,
        time: result.time ?? null,
        memory: result.memory ?? null,
      };
    }
  }

  throw new Error(
    "Code execution timed out while waiting for Judge0."
  );
};
