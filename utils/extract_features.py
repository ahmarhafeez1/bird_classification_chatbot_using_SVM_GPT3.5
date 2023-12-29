import numpy as np
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
from keras.applications.vgg16 import VGG16


vgg_model = VGG16(weights='imagenet', include_top=False)

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