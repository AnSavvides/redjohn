from flask import Flask
from flask import jsonify
from red_api import get_suspect_mentions
from jsonp_flask import support_jsonp

app = Flask(__name__)

@app.route('/api/suspects/mentions', methods=['GET'])
@support_jsonp
def get_mentions():
    return jsonify(results=get_suspect_mentions())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')