import json
import urllib.request
import sys

def test_button_and_data_flow(base_url="http://127.0.0.1:8000"):
    print("=== Interactive Event & Data Matching Test ===")
    
    # 1. Test JS asset accessibility
    js_url = f"{base_url}/wp-content/themes/piano-paradise/assets/js/serial-lookup.js"
    try:
        with urllib.request.urlopen(js_url, timeout=5) as resp:
            content = resp.read().decode('utf-8')
            print(f"[PASS] JS Asset Status: {resp.getcode()} (Size: {len(content)} bytes)")
            assert "initSerialLookup" in content or "handleLookup" in content
            print("  - Event Handler (initSerialLookup / handleLookup): [VERIFIED]")
    except Exception as e:
        print(f"[FAIL] JS Asset Check Error: {e}")

    # 2. Test JSON database matching
    data_url = f"{base_url}/wp-content/themes/piano-paradise/assets/serial_data.json"
    try:
        with urllib.request.urlopen(data_url, timeout=5) as resp:
            raw_json = resp.read().decode('utf-8')
            data = json.loads(raw_json)
            print(f"[PASS] Serial JSON Database Status: {resp.getcode()} (Brands: {len(data)})")
            
            # Test YAMAHA 4500000 lookup
            yamaha_ranges = data.get('YAMAHA', [])
            matched = [item for item in yamaha_ranges if 4500000 >= item['start'] and 4500000 <= item['end']]
            if matched:
                print(f"  - YAMAHA #4500000 Lookup Result: Year {matched[0]['year']} [PASS]")
            else:
                print("  - YAMAHA #4500000 Lookup Result: [FAIL]")
    except Exception as e:
        print(f"[FAIL] JSON Database Check Error: {e}")

if __name__ == '__main__':
    test_button_and_data_flow()
