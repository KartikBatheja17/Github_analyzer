import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import base64
from django.http import JsonResponse
from .ai_utils import generate_ai_analysis

token = os.getenv("GITHUB_TOKEN")
header = {}
if token:
    header["Authorization"] = f"token {token}"
    print("TOKEN VALUE", token)
    print("HEADER VALUE", header)

rate_check = requests.get("https://api.github.com/rate_limit", headers=header)

def home(request):
    return JsonResponse({"message": "GitHub Profile is running"})

@api_view(['GET'])
def analyze_profile(request,username):
    profile_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos"

    profile_response = requests.get(profile_url, headers = header)
    repos_response = requests.get(repos_url, headers = header)
    

    if profile_response.status_code != 200:
        return Response({"error": "User not found"}, status=404)
    
    profile_data = profile_response.json()
    repos_data = repos_response.json()

    total_stars = 0
    language_count = {}
    top_repos = []


    #calculate stars and languages used

    for repo in repos_data:
        total_stars += repo.get("stargazers_count",0)


        language = repo.get("language")
        if language:
            language_count[language] = language_count.get(language, 0) + 1



    # Sort repos by stars
    sorted_repos = sorted(
        repos_data,
        key=lambda x: x.get("stargazers_count", 0),
        reverse=True
    )

    # check readme for top 5 repo
    for repo in sorted_repos[:5]:
        readme_score = 0

        readme_present = False
        readme_length = 0
        has_installation = False
        has_usage = False
        has_screenshot = False

        readme_url = f"https://api.github.com/repos/{username}/{repo['name']}/readme"
        readme_response = requests.get(readme_url,headers=header)

        if readme_response.status_code == 200:
            try:
                readme_present = True 
                readme_json = readme_response.json()
                content = readme_json.get("content"," ")
                if content:
                    decoded_content = base64.b64decode(content).decode("utf-8")
                    readme_length = len(decoded_content)
                    lower_content = decoded_content.lower()
                    has_installation = "installation" in lower_content 
                    has_usage = "usage" in lower_content
                    has_screenshots =( "![" in decoded_content or "<img" in lower_content   
                    )
            except Exception as e:
                print("Readme decoding error",e)         

        #readme_score logic
        
        if readme_present:
            readme_score += 2
        if readme_length > 500:
            readme_score += 2
        if has_installation:
            readme_score += 2
        if has_usage:
            readme_score += 2
        if has_screenshots:
            readme_score += 2
            
        top_repos.append({
            "name": repo['name'],
            "stars": repo['stargazers_count'],
            "language": repo['language'],
            "url": repo['html_url'],
            "readme_present": readme_present,
            "readme_length": readme_length,
            "has_installation": has_installation,
            "has_usage": has_usage,
            "has_screenshots": has_screenshots,
            "readme_score" : readme_score
        })



    # suggestions
    suggestions = []

    repo_count = profile_data.get("public_repos", 0)
    follower_count = profile_data.get("followers", 0)

    # Repo suggestion
    if repo_count < 10:
        suggestions.append(
            "Create more repositories to better showcase your skills."
        )

    # Stars suggestion
    if total_stars < 20:
        suggestions.append(
            "Promote your repositories to gain more visibility and stars."
        )

    # README suggestion
    if readme_score < 6:
        suggestions.append(
            "Improve README documentation quality."
        )

    # Followers suggestion
    if follower_count < 10:
        suggestions.append(
            "Increase activity to attract more followers."
        )

    # If nothing triggered
    if len(suggestions) == 0:
        suggestions.append(
            "Great job! Your profile looks strong. Keep building projects."
        )
    
    # Portfolio Score Calculation

    portfolio_score = 0

    # Repo Score (Max 30)
    repo_count = profile_data.get("public_repos", 0)
    portfolio_score += min(repo_count * 5, 30)

    # Stars Score (Max 25)
    portfolio_score += min(total_stars * 2, 25)

    # README Score (Max 25)
    portfolio_score += min(readme_score * 5, 25)

    # Language Diversity (Max 20)
    portfolio_score += min(len(language_count) * 5, 20)
    
    #ai like summary
    primary_language = (max(language_count, key=language_count.get) if language_count else "Varied Technologies")
    
    summary = f"""
    This developer primarily has {profile_data.get('public_repos')} public repositories.
    with {total_stars} total stars. Primary focus appears to be {primary_language} .
    Documentation quality is {'strong' if readme_score > 6 else 'need improvement'}.
    """
    # Generate AI analysis
    ai_analysis = generate_ai_analysis(profile_data, repos_data)
    print("AI Analysis:", ai_analysis)

    return Response({
        "profile": {
            "name": profile_data.get('name'),
            "avatar": profile_data.get('avatar_url'),
            "bio": profile_data.get('bio'),
            "followers": profile_data.get('followers'),
            "public_repos": profile_data.get('public_repos'),
            "following": profile_data.get('following'),
        },
        "analysis": {
            "total_stars": total_stars,
            "languages_used": language_count,
            "top_repositories": top_repos,
            "readme_score": readme_score,
            "portfolio_score": portfolio_score
        },
        "summary": summary,
        "suggestions": suggestions,
        "ai_analysis": ai_analysis
    })