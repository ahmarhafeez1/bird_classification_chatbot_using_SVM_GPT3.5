from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from keras.preprocessing import image
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from keras.preprocessing import image
from keras.applications.vgg16 import VGG16, preprocess_input
import os


app = FastAPI()

# Load the saved models and objects
svm_model = joblib.load('classification_model/svm_model.joblib')
pca = joblib.load('classification_model/pca_model.joblib')
scaler = joblib.load('classification_model/scaler_model.joblib')
le = joblib.load('classification_model/label_encoder_model.joblib')
class_id_label_mapping = joblib.load('classification_model/class_id_label_mapping.joblib')
vgg_model = VGG16(weights='imagenet', include_top=False)


bird_dict = {
    0.0: 'ABBOTTS BABBLER',
    1.0: 'ABBOTTS BOOBY',
    2.0: 'ABYSSINIAN GROUND HORNBILL',
    3.0: 'AFRICAN CROWNED CRANE',
    4.0: 'AFRICAN EMERALD CUCKOO',
    5.0: 'AFRICAN FIREFINCH',
    6.0: 'AFRICAN OYSTER CATCHER',
    7.0: 'AFRICAN PIED HORNBILL',
    8.0: 'AFRICAN PYGMY GOOSE',
    9.0: 'ALBATROSS',
    10.0: 'ALBERTS TOWHEE',
    11.0: 'ALEXANDRINE PARAKEET',
    12.0: 'ALPINE CHOUGH',
    13.0: 'ALTAMIRA YELLOWTHROAT',
    14.0: 'AMERICAN AVOCET',
    15.0: 'AMERICAN BITTERN',
    16.0: 'AMERICAN COOT',
    17.0: 'AMERICAN FLAMINGO',
    18.0: 'AMERICAN GOLDFINCH',
    19.0: 'AMERICAN KESTREL'
}




def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(200, 200))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array


def extract_features(img_path):
    img_array = preprocess_image(img_path)
    features = vgg_model.predict(img_array)
    return features.flatten()

def get_prediction(img_path):
    img_array = extract_features(img_path)
    img_features = pca.transform(scaler.transform(img_array.reshape(1, -1)))
    prediction = svm_model.predict(img_features)
    predicted_class = le.inverse_transform(prediction)[0]
    return predicted_class

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        # Save the uploaded image temporarily
        print("HERE")
        with open("temp_image.jpg", "wb") as temp_image:
            temp_image.write(file.file.read())
        print("HERE2")
        # Get the prediction for the uploaded image
        prediction = get_prediction("temp_image.jpg")
        print("HERE2")
        # Delete the temporary image file
        os.remove("temp_image.jpg")

        # Return the prediction as JSON
        return JSONResponse(content={"prediction": prediction, "name": bird_dict[float(prediction)] }, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
