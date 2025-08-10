import requests

# Endpoint for controlling probe/camera light
URL = "http://192.168.1.1/v1/rov/leds"

def set_probe_light(turn_on: bool):
    payload = {
        "brightness": 100 if turn_on else 0,
        "ledid": 2 if turn_on else -1  # 2 = camera light ON, -1 = turn all lights OFF
    }

    try:
        response = requests.post(URL, json=payload)
        if response.status_code == 200:
            print("✅ Light turned", "ON" if turn_on else "OFF")
        else:
            print(f"❌ Failed: Status code {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    state = input("Turn light ON or OFF? (on/off): ").strip().lower()
    if state == "on":
        set_probe_light(True)
    elif state == "off":
        set_probe_light(False)
    else:
        print("❌ Invalid input. Type 'on' or 'off'.")
