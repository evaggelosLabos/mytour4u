import requests
import time

URL = "http://192.168.1.1/v1/params/cable"

def set_out_probe():
    start_payload = {
        "roll_on": True,
        "dir": 2  # 2 = Lower (Set out)
    }
    stop_payload = {
        "roll_on": False
    }

    try:
        # Start lowering
        response = requests.post(URL, json=start_payload)
        if response.status_code == 200:
            print("🔽 Lowering probe...")
        else:
            print(f"❌ Start failed: {response.status_code}")
            return

        # Let it run for 3 seconds (adjust as needed)
        time.sleep(3)

        # Stop the motor
        response = requests.post(URL, json=stop_payload)
        if response.status_code == 200:
            print("🛑 Probe lowering stopped.")
        else:
            print(f"❌ Stop failed: {response.status_code}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    set_out_probe()
