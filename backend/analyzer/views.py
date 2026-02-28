import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def analyze_profile(request,username):
    profile_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos"

    profile_response = requests.get(profile_url)
    repos_response = requests.get(repos_url)


    if profile_response.status_code != 200:
        return Response({"error": "User not found"}, status=404)
    
    profile_data = profile_response.json()
    repos_data = repos_response.json()
    total_stars = 0
    language_count = {}
    top_repos = []

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

    for repo in sorted_repos[:5]:
        top_repos.append({
            "name": repo['name'],
            "stars": repo['stargazers_count'],
            "language": repo['language'],
            "url": repo['html_url']
        })

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
            "top_repositories": top_repos
        }
    })

    