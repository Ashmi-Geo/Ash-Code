from flask import Flask, jsonify, request
import json
from flask_cors import CORS
from flask_ngrok import run_with_ngrok

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "supports_credentials": True}})
# run_with_ngrok(app)

@app.route('/data', methods =['POST'])
def get_data():
    try:
        print(request.__dict__)
        with open('data.json', 'r') as f:
            my_dict = json.load(f)
        print(my_dict)
        # time.sleep(3)
        res = jsonify(my_dict)
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return res
    
    except Exception as e:
        return jsonify({"error": str(e)})
        # print(e)

    

if __name__ == '__main__':
    app.run()