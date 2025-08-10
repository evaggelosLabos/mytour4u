import requests

# URL of the internal light controller (probe module)
URL = "http://192.168.1.1/v1/params/led"

def toggle_light(turn_on=True):
    payload = {"onoff": turn_on}
    try:
        response = requests.post(URL, json=payload)
        if response.status_code == 200:
            print("✅ Light", "ON" if turn_on else "OFF", "command sent.")
        else:
            print(f"❌ Failed: Status code {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    state = input("Turn light ON or OFF? (on/off): ").strip().lower()
    if state == "on":
        toggle_light(True)
    elif state == "off":
        toggle_light(False)
    else:
        print("❌ Invalid input")
