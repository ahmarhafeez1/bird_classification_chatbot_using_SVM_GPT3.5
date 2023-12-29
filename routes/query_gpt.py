from fastapi import APIRouter
from fastapi.responses import JSONResponse
from utils.gpt_query import query_gpt



router = APIRouter()

@router.post("/query_gpt/")
async def query_gpt_route(query: str, bird: str, ):
    try:
        # Save the uploaded image temporarily
        gpt_response = await query_gpt(query=query,bird=bird)
        # Return the prediction as JSON
        return JSONResponse(content={"query_response": gpt_response }, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
