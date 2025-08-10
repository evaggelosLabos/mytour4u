import requests
import time

URL = "http://192.168.1.1/v1/params/cable"

def take_up_and_stop():
    start_payload = {
        "roll_on": True,
        "dir": 1  # 1 = raise (take up)
    }
    stop_payload = {
        "roll_on": False
    }

    try:
        # Start raising
        response = requests.post(URL, json=start_payload)
        if response.status_code == 200:
            print("🔼 Raising the probe...")
        else:
            print(f"❌ Start failed: {response.status_code}")
            return

        # Wait 2 seconds
        time.sleep(3)

        # Stop raising
        response = requests.post(URL, json=stop_payload)
        if response.status_code == 200:
            print("🛑 Probe raise stopped.")
        else:
            print(f"❌ Stop failed: {response.status_code}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    take_up_and_stop()
