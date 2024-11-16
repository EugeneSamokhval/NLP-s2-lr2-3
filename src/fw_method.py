import nltk
from nltk.corpus import stopwords

english_words = set(stopwords.words('english'))
russian_words = set(stopwords.words('russian'))


def fw_predict_language(text):
    text = text.lower()
    words = text.split()

    english_count = sum(1 for word in words if word in english_words)
    russian_count = sum(1 for word in words if word in russian_words)

    if english_count > russian_count:
        return "English"
    elif russian_count > english_count:
        return "Russian"
    else:
        return "Unknown"
