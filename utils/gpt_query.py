import openai
import os
import string
from typing import List 



async def query_gpt(query: str, bird: str):
    
    prompt = f"""
You are a bird expert who is going to answer any question about the following bird {bird}
"""
    
    
    
    
    api_key = os.getenv("OPENAI_API_KEY")
    openai.api_key=api_key

    try:
        messages = [{"role": "system", "content": prompt},
                        {"role": "user", "content": query}
              ]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        gpt_response = response['choices'][0]['message']['content']

        return gpt_response
        
    except Exception as e:
        print(e)

        return ""

    