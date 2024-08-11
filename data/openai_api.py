import json
from openai import OpenAI
import os 
import dotenv

dotenv.load_dotenv()

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY"),
)


# Load the JSON data from the provided file
file_path = '/data/wohnberechtigungsschein_antrag_fields.json'
with open(file_path, 'r') as file:
    form_data = json.load(file)


# Extract the labels and prepare them for reformulation
labels_to_reformulate = {}
for section in form_data:
    for content_block in section['content']:
        for field in content_block:
            labels_to_reformulate[field['id']] = field['label']


# Function to reformulate a label into a question using GPT
def reformulate_question(label):
    prompt = f"Reformulate the following form field label into a clear and simple question: {label}"
    
    # Use the new API call
    response = openai.Completion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=60,
        temperature=0.7
    )
    question = response['choices'][0]['message']['content'].strip()
    return question


# Store the reformulated questions in a dictionary
reformulated_questions = {}

def reformulate_labels(labels_dict):
    for id, label in labels_dict.items():
        reformulated_questions[id] = reformulate_question(label)