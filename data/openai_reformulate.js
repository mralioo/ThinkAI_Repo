const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

// Set up OpenAI API configuration
const configuration = new Configuration({
  apiKey: 'your-openai-api-key', // Replace with your actual OpenAI API key
});
const openai = new OpenAIApi(configuration);

// Function to load the JSON data
const loadJSON = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

// Function to reformulate a label into a question
const reformulateQuestion = async (label) => {
  const prompt = `Reformulate the following form field label into a clear and simple question: ${label}`;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 60,
      temperature: 0.7,
    });
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return null;
  }
};

// Function to process the labels and generate reformulated questions
const processLabels = async (labels) => {
  const reformulatedQuestions = {};

  for (const id in labels) {
    const question = await reformulateQuestion(labels[id]);
    if (question) {
      reformulatedQuestions[id] = question;
    }
  }

  return reformulatedQuestions;
};

// Main function to handle the entire process
const main = async () => {
  const filePath = './wohnberechtigungsschein_antrag_fields.json'; // Replace with your file path
  const data = loadJSON(filePath);
  
  const labelsToReformulate = {};
  data.forEach(section => {
    section.content.forEach(block => {
      block.forEach(field => {
        labelsToReformulate[field.id] = field.label;
      });
    });
  });

  const reformulatedQuestions = await processLabels(labelsToReformulate);

  // Save the reformulated questions to a new JSON file
  const outputFilePath = './reformulated_questions.json'; // Replace with your desired output path
  fs.writeFileSync(outputFilePath, JSON.stringify(reformulatedQuestions, null, 2));

  console.log('Reformulated questions have been saved to', outputFilePath);
};

main();
