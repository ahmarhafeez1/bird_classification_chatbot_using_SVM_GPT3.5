from fastapi import APIRouter
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
from utils.get_prediction import get_prediction
from utils.bird_dict import bird_dict
import os



router = APIRouter()

@router.post("/bird_classification/")
async def predict_image(file: UploadFile = File(...)):
    try:
        # Save the uploaded image temporarily

        with open("temp_image.jpg", "wb") as temp_image:
            temp_image.write(file.file.read())
        
        # Get the prediction for the uploaded image
        prediction = get_prediction("temp_image.jpg")

        # Delete the temporary image file
        os.remove("temp_image.jpg")

        # Return the prediction as JSON
        return JSONResponse(content={"prediction": prediction, "name": bird_dict[float(prediction)] }, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
