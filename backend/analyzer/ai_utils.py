import os
import google.generativeai as genai

# Configure Gemini API
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_ai_analysis(profile_data, repos_data):
    try:
        username = profile_data.get("login", "developer")
        repo_count = profile_data.get("public_repos", 0)
        followers = profile_data.get("followers", 0)

        prompt = f"""
        Analyze this GitHub developer profile.

        Return the response in plain text format.
        Do NOT use markdown or bullet symbols.

        Username: {username}
        Public Repositories: {repo_count}
        Followers: {followers}

        Provide:
        Skill Level
        Strengths
        Weaknesses
        Career Suggestions

        Keep response short (under 120 words).
        """

        model = genai.GenerativeModel(
            "gemini-2.5-flash-lite"
        )

        response = model.generate_content(prompt)

        return response.text

    except Exception as e:
        print("GEMINI ERROR:", e)
        return "AI analysis unavailable."