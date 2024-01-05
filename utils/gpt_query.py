from openai import OpenAI
import os
from typing import List 


async def query_gpt(
    query: str, 
    bird: str, 
    messages: List = None
    ):
    

    prompt = f"You are a bird expert. You have the knowledge regarding all the species of birds and today your are going to answer all the question regarding {bird}"

    
    
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI()
    try:
        if(messages == None):
            messages = [
                            {"role": "system", "content": prompt},
                            {"role": "user", "content": query},
                       ]
        else:
             temp_messages = [
                            {"role": "system", "content": prompt}
                       ]
             messages = temp_messages + messages
             messages.append( {"role": "user", "content": query})

        completion = client.chat.completions.create(
             model="gpt-3.5-turbo",
            messages=messages
        )
        
        gpt_response = completion.choices[0].message.content
        messages.append({"role": "system", "content": gpt_response})
        return gpt_response
        
    except Exception as e:
        print(e)
        return ""

    