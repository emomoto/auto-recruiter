import os
import requests
from dotenv import load_dotenv
from functools import cache

load_dotenv()

JOB_PORTAL_API_KEY = os.getenv("JOB_PORTAL_API_KEY")
HR_SOFTWARE_API_KEY = os.getenv("HR_SOFTWARE_API_KEY")

JOB_PORTAL_BASE_URL = "https://api.examplejobportal.com"
HR_SOFTWARE_BASE_URL = "https://api.examplehrsoftware.com"

REQUIRED_SKILLS = ["Python", "Django", "APIs"]
MIN_EXP_YEARS = 2

@cache
def get_job_applications():
    endpoint = f"{JOB_PORTAL_BASE_URL}/applications"
    headers = {"Authorization": f"Bearer {JOB_PORTAL_API_KEY}"}
    response = requests.get(endpoint, headers=headers)
    return response.json()

def filter_candidates(applications):
    filtered_candidates = []
    for application in applications:
        skills = application['skills']
        years_of_experience = application['experience']
        
        if all(skill in skills for skill in REQUIRED_SKILLS) and years_of_experience >= MIN_EXP_YEARS:
            filtered_candidates.append(application)
            
    return filtered_candidates

def send_emails_to_candidates(candidates):
    endpoint = f"{HR_SOFTWARE_BASE_URL}/send-email"
    headers = {"Authorization": f"Bearer {HR_SOFTWARE_API_KEY}"}
    
    for candidate in candidates:
        payload = {
            "email": candidate['email'],
            "subject": "Job Application Status",
            "message": "Congratulations! Your application has progressed to the next stage."
        }
        response = requests.post(endpoint, json=payload, headers=headers)
        if response.status_code == 200:
            print(f"Email sent successfully to {candidate['email']}")
        else:
            print(f"Failed to send email to {candidate['email']}")

def main():
    print("Fetching job applications...")
    applications = get_job_applications()
    
    print("Filtering candidates based on criteria...")
    filtered_candidates = filter_candidates(applications)

    if filtered_candidates:
        print("Sending emails to filtered candidates...")
        send_emails_to_candidates(filtered_candidates)
    else:
        print("No suitable candidates found.")

if __name__ == "__main__":
    main()