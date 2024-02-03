from fastapi import FastAPI
from routes.bird_classification import router as bird_classification_router
from routes.query_gpt import router as query_gpt_router
from routes.get_bird_image import router as image_router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


#Loading Dotenv File
load_dotenv()
origins = [
    "http://localhost:3000",
    "http://0.0.0.0:3000",  
]



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(bird_classification_router)
app.include_router(query_gpt_router)
app.include_router(image_router)