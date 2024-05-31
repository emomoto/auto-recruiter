import os
import re
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

nltk.download('punkt')
nltk.download('stopwords')

from dotenv import load_dotenv
load_dotenv()

RESUME_PATH = os.getenv('RESUME_PATH', 'resumes/')

def parse_resume(resume_path):
    try:
        with open(resume_path, 'r', encoding='utf-8') as file:
            resume_content = file.read()
        return resume_content
    except FileNotFoundError:
        print(f"Resume file {resume_path} not found.")
        return None

def analyze_keywords(text, keywords):
    word_tokens = word_tokenize(text.lower())
    stop_words = stopwords.words('english')
    filtered_sentence = [w for w in word_tokens if w not in stop_words]
    
    keywords_found = {}
    for keyword in keywords:
        count = sum(1 for word in filtered_sentence if word == keyword.lower())
        if count > 0:    
            keywords_found[keyword] = count
    
    return keywords_found

def generate_summary(reports):
    print("Summary Report")
    print("==============")
    for report in reports:
        print(f"Resume: {report['resume']}")
        print(f"Total Keywords Found: {len(report['keywords'])}")
        for keyword, count in report['keywords'].items():
            print(f"{keyword}: {count}")
        print("--------------\n")

def main():
    resumes = [RESUME_PATH + f for f in os.listdir(RESUME_PATH) if os.path.isfile(os.path.join(RESUME_PATH, f))]
    
    keywords = ['Python', 'Java', 'SQL', 'JavaScript']

    reports = []
    
    for resume_path in resumes:
        text = parse_resume(resume_path)
        if text:
            keyword_analysis = analyze_keywords(text, keywords)
            reports.append({
                'resume': resume_path,
                'keywords': keyword_analysis
            })
    
    generate_summary(reports)

if __name__ == "__main__":
    main()