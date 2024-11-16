from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import torch.nn as nn


model_name = "spolivin/lang-recogn-model"
# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)


def preprocess(text):
    inputs = tokenizer(text, return_tensors='pt',
                       truncation=True, padding=True)
    if 'token_type_ids' in inputs:
        del inputs['token_type_ids']
    inputs = {k: v.to(device) for k, v in inputs.items()}
    return inputs

# Function to predict language


def neural_predict_language(text):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_language = torch.argmax(logits, dim=1).item()
    if predicted_language == 3:
        return 'English'
    if predicted_language == 12:
        return 'Russian'
    else:
        return predicted_language
