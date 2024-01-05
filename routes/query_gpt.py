from fastapi import APIRouter
from fastapi.responses import JSONResponse
from utils.gpt_query import query_gpt
from typing import List 



router = APIRouter()

@router.post("/query_gpt/")
async def query_gpt_route( query: str, bird: str, messages: List[dict[str,str]] = None):
    
    
    try:
        gpt_response = await query_gpt(bird=bird,query=query,messages=messages)
    
        return JSONResponse(
                content=
                {
                    "Query Response": gpt_response, 
                
                }, status_code=200)
    
    
    except Exception as e:
         return JSONResponse(content={"error": str(e)}, status_code=500)




