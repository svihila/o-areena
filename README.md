# o-areena
Lightweight Python-Flask-React client for consuming Yle Areena content via [Yle API](http://developer.yle.fi)

## Requirements:
- Python 3.5+ (+ pip and setuptools)
- Python package dependencies are determined in setup.py

## Installation and running development server:
- Get your Yle Api credentials from (https://tunnus.yle.fi/api-avaimet)
- Create config.py with your credentials (see config.py.example)
- (Using virtualenv is recommended)
- `pip install --editable .`
- `. run_dev.sh` 
- (...or in windows: `run_dev_win.bat`)
- Browser: localhost:5000
