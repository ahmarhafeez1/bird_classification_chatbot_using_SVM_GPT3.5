import os
from pexels_api import API
import random



  
  
def get_image(search_term:str):
    PEXELS_API_KEY = os.getenv('PEXELS_API_KEY')
    print(PEXELS_API_KEY)
    api = API(PEXELS_API_KEY)
    api.search('ABBOTTS BABBLER', page=1, results_per_page=5)
    # Get photo entries
    photos = api.get_entries()
    randomNumber = random.randint(1, len(photos) - 1)
    print('here')
    return photos[randomNumber].url
