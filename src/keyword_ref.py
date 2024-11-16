import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from string import punctuation


def keywords_ref(text, language):
    sentences_list = sent_tokenize(text)
    words_list = [word_tokenize(sentence) for sentence in sentences_list]
    stop_words = set(stopwords.words(language))
    words_list = [nltk.pos_tag(sentence) for sentence in words_list]
    allowed_tags_list = ['NNP', 'NNS', 'NN', 'JJ', 'JJR',
                         'JJS']
    words_list = [[word for word in sentence if (
        word[0] not in stop_words) and (word[0] != word[1]) and word[1] in allowed_tags_list] for sentence in words_list]
    all_words = word_tokenize(text)
    words_counter_dict = dict()
    for word in all_words:
        if (word in stop_words) or (word in punctuation):
            continue
        elif word not in words_counter_dict.keys():
            words_counter_dict[word] = 1
        else:
            words_counter_dict[word] += 1
    result = []
    max_count = max(words_counter_dict.values()) + 1
    for sentence in words_list:
        for word in sentence:
            if (word[0] in words_counter_dict.keys()) and (word[0] not in punctuation):
                result.append(
                    (word[0], abs(words_counter_dict.get(word[0]) - max_count)))
    result = list(set(result))
    result.sort(key=lambda x: x[1], reverse=True)
    return result
