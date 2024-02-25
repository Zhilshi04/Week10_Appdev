from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
import json

uri = "mongodb+srv://pannet6483:UFmb5CDnQ9ZdGUXl@cluster0.q4ezqm3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)
db = client['Product']
collection = db['Products']

app = Flask(__name__)
CORS(app)

@app.route("/")
@cross_origin()
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/products", methods=["GET"])
@cross_origin()
def get_all_products():
    try:
        products = list(collection.find())
        # Convert ObjectId to string for JSON serialization
        products_json = json.loads(json_util.dumps(products))
        return jsonify(products_json), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/products/<int:id>", methods=["DELETE"])
@cross_origin()
def delete_product(id):
    try:
        result = collection.delete_one({"_id": int(id)})
        if result.deleted_count > 0:
            return jsonify({"message": "Product deleted successfully"}), 200
        else:
            return jsonify({"message": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/products/<int:id>", methods=["PUT"])
@cross_origin()
def update_product(id):
    try:
        data = request.get_json()
        result = collection.update_one({"_id": int(id)}, {"$set": data})
        if result.modified_count > 0:
            updated_product = collection.find_one({"_id": int(id)})
            updated_product_json = json.loads(json_util.dumps(updated_product))
            return jsonify({"message": "Product updated successfully", "product": updated_product_json}), 200
        else:
            return jsonify({"message": "Product not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_product", methods=["POST"])
@cross_origin()
def add_product():
    try:
        data = request.form
        name = data.get("name")
        price = data.get("price")
        image = data.get("image")

        if not name or not price:
            return jsonify({"error": "Name and price are required fields"}), 400
        new_product = {
            "_id": collection.count_documents({}),
            "name": name,
            "price": int(price),
            "img": image
        }

        result = collection.insert_one(new_product)

        if result.inserted_id:
            new_product["_id"] = str(result.inserted_id)
            return jsonify({"message": "Product added successfully", "product": new_product}), 201
        else:
            return jsonify({"error": "Failed to add product"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
