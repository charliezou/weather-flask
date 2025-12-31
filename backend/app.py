import os
import hashlib
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
import requests
import dashscope
#from dashscope.audio.tts import SpeechSynthesizer

# 使用语音合成新接口以支持最新模型
from dashscope import MultiModalConversation

app = Flask(__name__)
CORS(app)  # 解决跨域问题

# --- 配置区 ---
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
dashscope.api_key = DASHSCOPE_API_KEY

CACHE_DIR = "audio_cache"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

# Qwen Chat API 地址
QWEN_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"

# --- 路由 1: 故事生成 ---
@app.route('/api/story', methods=['POST'])
def generate_story():
    data = request.json
    animal_details = data.get('animalDetails', '')

    if not animal_details:
        return jsonify({"error": "Missing animal details"}), 400

    payload = {
        "model": "qwen-max",
        "messages": [
            {
                "role": "system", 
                "content": "你是一位儿童故事作家，创作150字左右、有教育意义的气象科普故事。"
            },
            {
                "role": "user", 
                "content": f"基于以下动物行为创作故事：{animal_details}"
            }
        ],
        "temperature": 0.8
    }

    headers = {
        "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(QWEN_URL, json=payload, headers=headers)
        res_data = response.json()
        story_text = res_data['choices'][0]['message']['content']
        return jsonify({"text": story_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 路由 2: 语音合成 (带缓存) ---
@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "Text is required"}), 400

    # 生成缓存文件名
    file_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    file_path = os.path.join(CACHE_DIR, f"{file_hash}.mp3")

    # 检查缓存
    if os.path.exists(file_path):
        return send_file(file_path, mimetype="audio/mpeg")

    try:
        # 调用 DashScope SDK
        """
        result = SpeechSynthesizer.call(
            model='sambert-zhichu-v1',
            text=text,
            sample_rate=16000,
            format='mp3',
        )
        
        if result.get_audio_data():
            with open(file_path, 'wb') as f:
                f.write(result.get_audio_data())
            return send_file(file_path, mimetype="audio/mpeg")
        """

        response = MultiModalConversation.call(
            model="qwen-tts",
            text=text,
            voice="Serena",
            language_type="Chinese"
        )

        audio_url = response.output.audio.url
        audio_data = requests.get(audio_url, timeout=30).content
        
        # 检查是否成功返回音频数据
        if audio_data:
            with open(file_path, 'wb') as f:
                f.write(audio_data)
            return send_file(file_path, mimetype="audio/mpeg")

        return jsonify({"error": "TTS synthesis failed"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # 这里的 port=5000 对应前端 fetch 的端口
    app.run(host='0.0.0.0', port=5000, debug=True)