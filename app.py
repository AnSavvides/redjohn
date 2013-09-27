from flask import Flask
from flask import jsonify
from red_api import get_suspect_mentions

# from datetime import datetime

app = Flask(__name__)

@app.route('/api/suspects/mentions', methods=['GET'])
def get_mentions():
    return jsonify(results=get_suspect_mentions())
