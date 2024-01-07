from fastapi import APIRouter
from fastapi.responses import JSONResponse
from utils.get_images import get_image



router = APIRouter()

@router.post("/get_bird_image/")
async def query_gpt_route(search_term: str):
    
    
    try:
        image_link = get_image(search_term=search_term)
    
        return JSONResponse(
                content=
                {
                    "image_link": image_link, 
                
                }, status_code=200)
    
    
    except Exception as e:
         return JSONResponse(content={"error": str(e)}, status_code=500)