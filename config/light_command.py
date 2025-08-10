import socket

# Command to toggle light (from earlier analysis)
command_hex = "474631303332324330303834"  # GF10322C0084
command_bytes = bytes.fromhex(command_hex)

ip = "192.168.1.48"  # F1 Pro IP
port = 7680          # F1 Pro TCP command port

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((ip, port))
    s.send(command_bytes)
    print("Light command sent.")
