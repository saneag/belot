"""Start Belot and retain its current temporary URL whenever possible."""
import json
import pathlib
import re
import socket
import subprocess
import time
import urllib.request

root = pathlib.Path(__file__).resolve().parents[1]
env_path = root / ".env"

def run(*args, capture=False):
    return subprocess.run(args, check=True, text=True,
                          stdout=subprocess.PIPE if capture else None).stdout

def save(values):
    lines = env_path.read_text().splitlines()
    keys = set(values)
    lines = [line for line in lines if line.split("=", 1)[0] not in keys]
    lines.extend(f"{key}={value}" for key, value in values.items())
    env_path.write_text("\n".join(lines) + "\n")
    env_path.chmod(0o600)

settings = dict(line.split("=", 1) for line in env_path.read_text().splitlines()
                if "=" in line and not line.startswith("#"))
port = int(settings.get("WEB_PORT", "5008"))
containers = run("sudo", "docker", "compose", "ps", "-q", "web", capture=True).strip()
if not containers:
    reserved = run("sudo", "docker", "ps", "--format", "{{.Ports}}", capture=True)
    while True:
        with socket.socket() as sock:
            if sock.connect_ex(("127.0.0.1", port)) != 0 and f":{port}->" not in reserved:
                break
        port += 1
save({"WEB_PORT": str(port)})
run("sudo", "docker", "compose", "up", "-d", "--wait", "--wait-timeout", "180")

def current_url():
    invocation = run("sudo", "systemctl", "show", "belot-tunnel.service",
                     "--property=InvocationID", "--value", capture=True).strip()
    if not invocation:
        return None
    logs = run("sudo", "journalctl", "--no-pager", "-o", "cat",
               f"_SYSTEMD_INVOCATION_ID={invocation}", capture=True)
    urls = re.findall(r"https://[a-z0-9-]+\.trycloudflare\.com", logs)
    return urls[-1] if urls else None

active = subprocess.run(["systemctl", "is-active", "--quiet", "belot-tunnel.service"]).returncode == 0
if not active or settings.get("TUNNEL_PORT") != str(port):
    subprocess.run(["sudo", "systemctl", "stop", "belot-tunnel.service"], check=False)
    subprocess.run(["sudo", "systemctl", "reset-failed", "belot-tunnel.service"], check=False)
    run("sudo", "systemd-run", "--unit=belot-tunnel", "--collect",
        "/usr/local/bin/cloudflared", "tunnel", "--url", f"http://127.0.0.1:{port}",
        "--no-autoupdate")
url = None
for _ in range(90):
    url = current_url()
    if url:
        break
    time.sleep(1)
if not url:
    raise SystemExit("App is running; inspect journalctl -u belot-tunnel for tunnel status")
save({"CORS_ORIGIN": url, "TUNNEL_PORT": str(port)})
run("sudo", "docker", "compose", "up", "-d", "--wait", "--wait-timeout", "180")
for attempt in range(60):
    try:
        with urllib.request.urlopen(url + "/api/health", timeout=10) as response:
            assert json.load(response)["status"] == "ok"
        break
    except Exception:
        if attempt == 59:
            raise
        time.sleep(2)
(root / ".public-url").write_text(url + "\n")
print(f"Belot: {url}\nMobile API: {url}/api")
