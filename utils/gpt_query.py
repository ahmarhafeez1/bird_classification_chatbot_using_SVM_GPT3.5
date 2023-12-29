from openai import OpenAI
import os
from typing import List 



async def query_gpt(query: str, bird: str):
    
    prompt = f"""
You are a bird expert who is going to answer any question about the following bird {bird}
"""
    
    
    
    
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI()
    try:
        messages = [{"role": "system", "content": prompt},
                        {"role": "user", "content": query}
              ]
        completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
        )
        gpt_response = completion.choices[0].message.content

        return {
            "query_response": gpt_response
            }
        
    except Exception as e:
        print(e)

        return ""

    