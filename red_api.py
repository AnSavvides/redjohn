import os
from pymongo import DESCENDING
from pymongo import MongoClient
from bson.json_util import dumps

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_URI = 'mongodb://{0}:{1}@paulo.mongohq.com:10039/redjohn'.format(MONGO_USER, MONGO_PASSWORD)

# Open a connection to Mongo once
#
mongo_client = MongoClient(MONGO_URI)

red_john_tweets = mongo_client.redjohn.tweets

suspects = [
    'partridge', 'kirkland', 'bertram', 'stiles', 'haffner',
    'mcallister', 'smith'
]

def get_suspect_mentions():
    suspect_mentions = {}
    for suspect in suspects:
        mentions = red_john_tweets.find({
            'suspect': suspect 
        }).count()
        suspect_mentions[suspect] = mentions

    return suspect_mentions

def get_tweet_count():
    return red_john_tweets.count()

def get_suspect_tweets(suspect, limit=5):
    tweets = red_john_tweets.find({
        'suspect': suspect
    }).sort('entry_time', DESCENDING)[:limit]

    return dumps(tweets)