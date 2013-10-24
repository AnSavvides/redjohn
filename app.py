from flask import Flask
from flask import jsonify
from red_api import get_suspect_mentions, get_tweet_count, get_suspect_tweets
from jsonp_flask import support_jsonp

app = Flask(__name__)

@app.route('/api/tweets/suspects/count', methods=['GET'])
@support_jsonp
def get_mentions():
    return jsonify(results=get_suspect_mentions())

@app.route('/api/tweets/count', methods=['GET'])
@support_jsonp
def get_total_tweet_count():
    return jsonify(results=get_tweet_count())

@app.route('/api/tweets/<suspect>/<limit>')
@support_jsonp
def get_tweets(suspect, limit):
    return jsonify(results=get_suspect_tweets(suspect, limit))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')