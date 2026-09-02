import http.server
import socketserver
import os
import sys
import urllib.request
import urllib.parse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MediKioskHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        if self.path.startswith('/api/tts'):
            self.do_GET(head_only=True)
            return
        return super().do_HEAD()

    def do_GET(self, head_only=False):
        if self.path.startswith('/api/tts'):
            try:
                parsed = urllib.parse.urlparse(self.path)
                params = urllib.parse.parse_qs(parsed.query)
                tl = params.get('tl', ['hi'])[0]
                text = params.get('q', [''])[0]
                if not text:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'Missing text parameter')
                    return

                encoded_q = urllib.parse.quote(text)
                google_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={tl}&client=tw-ob&q={encoded_q}"
                req = urllib.request.Request(
                    google_url,
                    headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://translate.google.com/'
                    }
                )
                with urllib.request.urlopen(req, timeout=5) as response:
                    audio_data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(len(audio_data)))
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'public, max-age=86400')
                    self.end_headers()
                    if not head_only:
                        self.wfile.write(audio_data)
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                if not head_only:
                    self.wfile.write(f"Error: {e}".encode('utf-8'))
                return

        return super().do_GET()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), MediKioskHandler) as httpd:
        print(f"MediKiosk Server running at http://localhost:{PORT}")
        print(f"Serving files from {DIRECTORY}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)
