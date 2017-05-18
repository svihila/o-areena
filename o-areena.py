from flask import Flask
from flask import render_template

app = Flask(__name__)
#Load config module containing YLE API credentials
app.config.from_object('config')

#Yle api endpoints
api_urls = {'programs': 'https://external.api.yle.fi/v1/programs/items.json',
			'playouts': 'https://external.api.yle.fi/v1/media/playouts.json'}

# Render UI
@app.route('/')
def index():
	#return render_template('index.html')
	return app.config['YLE_APP_ID']

# Search programs matching the given keyword
@app.route('/programs')
def programs():
	return get_programs()


def get_programs():
	""" Returns program search results from YLE API by the given keyword """
	return ''

if __name__ == '__main__':
	app.run()