from flask import Flask
from flask import jsonify
from red_api import get_suspect_mentions, get_tweet_count
from jsonp_flask import support_jsonp

app = Flask(__name__)

@app.route('/api/suspects/mentions', methods=['GET'])
@support_jsonp
def get_mentions():
    return jsonify(results=get_suspect_mentions())

@app.route('/api/tweets/count', methods=['GET'])
@support_jsonp
def get_total_tweet_count():
    return jsonify(results=get_tweet_count)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')