import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from keras.preprocessing import image
from keras.applications.vgg16 import VGG16, preprocess_input
from utils.extract_features import extract_features


svm_model = joblib.load('classification_model/svm_model.joblib') 
pca = joblib.load('classification_model/pca_model.joblib')
scaler = joblib.load('classification_model/scaler_model.joblib')
le = joblib.load('classification_model/label_encoder_model.joblib')
class_id_label_mapping = joblib.load('classification_model/class_id_label_mapping.joblib')





# Load the saved models and objects




def get_prediction(img_path):
    img_array = extract_features(img_path)
    img_features = pca.transform(scaler.transform(img_array.reshape(1, -1)))
    prediction = svm_model.predict(img_features)
    predicted_class = le.inverse_transform(prediction)[0]
    return predicted_class
