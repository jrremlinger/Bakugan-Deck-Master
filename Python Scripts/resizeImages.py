from PIL import Image
import os

folder = 'assets/cards/08_GG'

for filename in os.listdir(folder):
    if filename.endswith('.jpg') or filename.endswith('.png'):
        image = Image.open(f'{folder}/{filename}')
        image.thumbnail((image.size[0]/3, image.size[1]/3))
        image.save(f'{folder}/thumbnail/thumb_{filename}')