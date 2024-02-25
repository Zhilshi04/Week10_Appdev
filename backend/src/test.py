from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
uri = "mongodb+srv://pannet6483:UFmb5CDnQ9ZdGUXl@cluster0.q4ezqm3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)
db = client['Product']
collection = db['Product']

data_list = list(collection.find())
print(type(data_list))
json_data = json.dumps(data_list, default=str)

print(type(json_data))

json_object = json.loads(json_data)
print(type(json_object))
print(json_object)

client.close()