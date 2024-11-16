def abc_predict_language(text):
    english_alphabet = set(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
    russian_alphabet = set(
        "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ")

    english_count = sum(1 for char in text if char in english_alphabet)
    russian_count = sum(1 for char in text if char in russian_alphabet)

    if english_count > russian_count:
        return "English"
    elif russian_count > english_count:
        return "Russian"
    else:
        return "Unknown"
