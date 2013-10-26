from pymongo import DESCENDING
from pymongo import MongoClient
from settings import MONGO_URI

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
        suspect_mentions[suspect] = {
            'count': mentions,
            'most_recent_tweets': get_recent_tweets(suspect)
        }

    return suspect_mentions

def get_tweet_count():
    return red_john_tweets.count()

def get_recent_tweets(suspect, limit=3):
    tweets = []

    raw_tweets = red_john_tweets.find({
        'suspect': suspect
    }).sort('entry_time', DESCENDING)[:limit]

    for tweet in raw_tweets:
        tweets.append({
            'text': tweet['text'],
            'user': tweet['user'],
            'created_at': tweet['created_at']
        })

    return tweets