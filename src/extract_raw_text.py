from bs4 import BeautifulSoup


def extract_text_from_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, 'lxml')
    text = soup.get_text(separator='\n')
    print(file_path)
    return text
