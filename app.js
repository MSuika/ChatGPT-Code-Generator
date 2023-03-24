// Import necessary modules
import { Configuration, OpenAIApi } from "openai";
import fs from"fs";
import readline from "readline";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a readline interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a new configuration object with OpenAI credentials
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create a new instance of the OpenAI API with the configuration object
const openai = new OpenAIApi(configuration);

// Define a function that generates code given a prompt using the OpenAI API
const generateCode = async (prompt) => {
    try {
      // Make a request to the OpenAI API to generate code
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      // Extract the generated code from the response
      const code = response.data.choices[0].text.trim();
      return code;
    } catch (error) {
      console.error(error);
    }
  };
  
// Define a function that appends generated code to a file
const appendCodeToFile = async (prompt, filePath) => {
  // Generate code using the generateCode function
  const code = await generateCode(prompt);
  // Append the generated code to the specified file
  fs.appendFile(filePath, `\n\n${code}`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Code generated and appended to ${filePath}`);
  });
};

// Define a function that prompts the user for a code prompt and appends generated code to a file
const askForPrompt = () => {
  // Prompt the user for a code prompt
  rl.question("Enter your code prompt: ", (prompt) => {
    // If the user enters "exit", close the readline interface and exit the program
    if (prompt.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    // Append generated code to a file using the appendCodeToFile function
    appendCodeToFile(prompt, "./generatedCode.js");
    // Prompt the user for another code prompt
    askForPrompt();
  });
};

// Call the askForPrompt function to start the program
askForPrompt();
