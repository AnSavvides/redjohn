import os
import json
from datetime import datetime

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

from pymongo import MongoClient

red_john_text = ['red john', 'redjohn']

suspects = [
    'partridge', 'kirkland', 'bertram', 'stiles', 'haffner',
    'mcallister', 'smith'
]

# Use environment variables to set up all our keys and tokens
#
consumer_key = os.getenv('CONSUMER_KEY')
consumer_secret = os.getenv('CONSUMER_SECRET')
access_token = os.getenv('ACCESS_TOKEN')
access_token_secret = os.getenv('ACCESS_SECRET')

# All relevant tweet information will be stored in MongoDB, but
# feel free to change this if Mongo is not your cup of tea. If
# you do decide to go with Mongo, check out MongoHQ as it can
# make life a lot easier.
#
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_URI = 'mongodb://{0}:{1}@paulo.mongohq.com:10039/redjohn'.format(MONGO_USER, MONGO_PASSWORD)

# Open a connection to Mongo once
#
mongo_client = MongoClient(MONGO_URI)

class RedJohnListener(StreamListener):
    """
    A listener handles tweets are the received from the stream.
    This is a basic listener that just prints received tweets to stdout.
    """
    def on_data(self, raw_data):
        data = json.loads(raw_data)
        tweet_text = data['text']
        found_suspect = False

        # Try to check that first of all the tweet does indeed refer to
        # 'Red John' and not something like 'John likes red apples'.
        # Following on, try and see if a suspect matches; note that
        # this is a pretty crude way of matching suspects to tweets
        # as it does not take into consideration first names, nor
        # spelling (e.g. someone might spell Stiles as Styles).
        #
        for text in red_john_text:
            if text in tweet_text.lower():
                for suspect in suspects:
                    created_at = datetime.strptime(data['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
                    user = data['user']
                    redjohn_collection = self.get_redjohn_collection()
                    if suspect in tweet_text.lower():
                        found_suspect = True
                        redjohn_collection.insert({
                            'text': data['text'],
                            'created_at': created_at,
                            'entry_time': datetime.now(),
                            'user': {
                                'name': user['name'],
                                'screen_name': user['screen_name'],
                                'id': user['id']
                            },
                            'suspect': suspect
                        })

                if not found_suspect:
                    redjohn_collection.insert({
                        'text': data['text'],
                        'created_at': created_at,
                        'entry_time': datetime.now(),
                        'user': {
                            'name': user['name'],
                            'screen_name': user['screen_name'],
                            'id': user['id']
                        },
                        'suspect': None
                    })
            return True
        return True

    def on_error(self, status):
        print status

    def get_redjohn_collection(self):
        return mongo_client.redjohn.tweets

if __name__ == '__main__':
    red_john_listener = RedJohnListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    stream = Stream(auth, red_john_listener)
    stream.filter(track=red_john_text)