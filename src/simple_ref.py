import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.probability import FreqDist
from heapq import nlargest


def summarize_text(text, n_sentences=5, language='english'):
    # Определение языка и загрузка соответствующих стоп-слов
    stop_words = set(stopwords.words(language))

    # Токенизация текста на предложения
    sentences = sent_tokenize(text, language=language)

    # Токенизация текста на слова и удаление стоп-слов
    words = word_tokenize(text.lower(), language=language)
    filtered_words = [word for word in words if word.isalnum()
                      and word not in stop_words]

    # Подсчет частотности слов
    freq_dist = FreqDist(filtered_words)

    # Оценка предложений
    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower(), language=language):
            if word in freq_dist:
                if sentence not in sentence_scores:
                    sentence_scores[sentence] = freq_dist[word]
                else:
                    sentence_scores[sentence] += freq_dist[word]

    # Выбор ключевых предложений
    summary_sentences = nlargest(
        n_sentences, sentence_scores, key=sentence_scores.get)
    summary = ' '.join(summary_sentences)

    return summary
