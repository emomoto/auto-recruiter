import os
import requests
from dotenv import load_dotenv
from functools import cache

load_dotenv()

JOB_PORTAL_API_KEY = os.getenv("JOB_PORTAL_API_KEY")
HR_SYSTEM_API_KEY = os.getenv("HR_SYSTEM_API_KEY")
JOB_PORTAL_API_URL = "https://api.examplejobportal.com"
HR_SYSTEM_API_URL = "https://api.examplehrsoftware.com"

REQUIRED_JOB_SKILLS = ["Python", "Django", "APIs"]
MINIMUM_EXPERIENCE_YEARS = 2

@cache
def fetch_job_applications():
    endpoint = f"{JOB_PORTAL_API_URL}/applications"
    headers = {"Authorization": f"Bearer {JOB_PORTAL_API_KEY}"}
    response = requests.get(endpoint, headers=headers)
    return response.json()

def qualify_candidates(applications):
    qualified_candidates = []
    for application in applications:
        candidate_skills = application['skills']
        candidate_experience = application['experience']
        
        has_required_skills = all(skill in candidate_skills for skill in REQUIRED_JOB_SKILLS)
        meets_experience_requirement = candidate_experience >= MINIMUM_EXPERIENCE_YEARS
        
        if has_required_skills and meets_experience_requirement:
            qualified_candidates.append(application)
            
    return qualified_candidates

def notify_qualified_candidates(candidates):
    endpoint = f"{HR_SYSTEM_API_URL}/send-emails-batch"
    headers = {"Authorization": f"Bearer {HR_SYSTEM_API_KEY}"}
    
    email_details_list = [
        {
            "email": candidate['email'],
            "subject": "Job Application Status",
            "message": "Congratulations! Your application has progressed to the next stage."
        } for candidate in candidates
    ]
    
    response = requests.post(endpoint, json={"emails": email_details_list}, headers=headers)
    
    if response.status_code == 200:
        print(f"Batch email sent successfully to {len(candidates)} candidates.")
    else:
        print("Failed to send batch email to candidates.")

def main():
    print("Fetching job applications...")
    job_applications = fetch_job_applications()
    
    print("Qualifying candidates based on criteria...")
    qualified_candidates = qualify_candidates(job_applications)

    if qualified_candidates:
        print("Notifying qualified candidates...")
        notify_qualified_candidates(qualified_candidates)
    else:
        print("No qualified candidates found.")

if __name__ == "__main__":
    main()