from flask import Flask
from flask import jsonify
from red_api import get_suspect_mentions

app = Flask(__name__)

@app.route('/api/suspects/mentions', methods=['GET'])
def get_mentions():
    return jsonify(results=get_suspect_mentions())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')