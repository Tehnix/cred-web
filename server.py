"""
Minimal server for serving the index page and some static javascript files.

"""
import sys
import os
import yaml
from flask import Flask, Response, request, render_template


# Our App declaring the location of the static files
app = Flask(__name__, static_url_path='', static_folder='public')
# Mainly used to check that the config file has the needed fields
default_config = {
    'port': 3000,
    'hostname': '',
    'apikey': ''
}


def load_config_file(filename):
    """Load the YAML configuration file."""
    try:
        config = None
        with open(filename, 'r') as f:
            config = yaml.load(f)
            print('Using configuration at {0}'.format(filename))
        if not config.keys() == default_config.keys():
            print('Invalid configuration file! (either missing or too many fields!)')
            sys.exit(1)
        return config
    except yaml.constructor.ConstructorError as e:
        print('Failed to parse configuration file! At {0}'.format(filename))
        sys.exit(1)
    except FileNotFoundError as e:
        print('Found no file at {0}'.format(filename))
        sys.exit(1)

config = load_config_file('config.yaml')


@app.route('/')
@app.route('/index')
def index():
    hostname = config['hostname']
    apikey = config['apikey']
    return render_template(
        'index.html',
        hostname=hostname,
        apikey=apikey
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config['port'])
