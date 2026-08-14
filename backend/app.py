"""
Simple Contact Form Mail Sender - Flask
Sends the message as plain text, with optional file/image attachments.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

# Max total upload size: 15 MB (Gmail's limit is 25MB, leave headroom)
app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024

mail = Mail(app)
CORS(app)

# Only allow these file types to be attached (adjust as you like)
ALLOWED_EXTENSIONS = {
    'png', 'jpg', 'jpeg', 'gif', 'webp',
    'pdf', 'doc', 'docx', 'txt', 'zip'
}
MAX_FILES = 5


def is_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({
        'status': 'ok',
        'message': 'Portfolio contact API is running'
    })
@app.route('/test-mail', methods=['GET'])
def test_mail():
    try:
        msg = Message(
            subject='Render Gmail Test',
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[app.config['MAIL_USERNAME']],
            body='This is a test email from the Render Flask backend.'
        )

        mail.send(msg)

        return jsonify({
            'success': True,
            'message': 'Test email sent'
        })

    except Exception as error:
        print(f"MAIL ERROR: {error}")
        return jsonify({
            'success': False,
            'error': str(error)
        }), 500
@app.route('/api/contact', methods=['POST'])
def contact_form():
    try:
        # Form fields now come from multipart/form-data, not JSON
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({'success': False, 'message': 'Name, email, and message are required'}), 400

        # Collect and validate attachments (input field name: "files")
        uploaded_files = request.files.getlist('files')
        # Drop empty file inputs (browsers send an empty FileStorage if none selected)
        uploaded_files = [f for f in uploaded_files if f and f.filename]

        if len(uploaded_files) > MAX_FILES:
            return jsonify({'success': False, 'message': f'Max {MAX_FILES} files allowed'}), 400

        for f in uploaded_files:
            if not is_allowed_file(f.filename):
                return jsonify({
                    'success': False,
                    'message': f'File type not allowed: {f.filename}'
                }), 400

        msg = Message(
            subject=f"New message from {name}",
            recipients=[os.getenv('MAIL_USERNAME')],
            body=message,
            reply_to=email)

        # Attach each uploaded file to the email
        for f in uploaded_files:
            msg.attach(
                filename=f.filename,
                content_type=f.content_type or 'application/octet-stream',
                data=f.read()
            )

        mail.send(msg)

        return jsonify({'success': True, 'message': 'Message sent'}), 200

    except Exception as error:
        print(f"Error: {str(error)}")
        return jsonify({'success': False, 'message': 'Failed to send message'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5001)), debug=True)