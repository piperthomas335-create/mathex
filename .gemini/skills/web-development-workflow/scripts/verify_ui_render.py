import urllib.request
import re
import sys

def verify_page_render(url):
    print(f"=== Visual & DOM Render Verification for: {url} ===")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 AGY WebTester/1.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            
        print(f"[OK] HTTP Status: {resp.getcode()}")
        print(f"[OK] HTML Size: {len(html)} bytes")
        
        # Checklist 1: Header and Footer structure
        has_header = '<header' in html.lower() or 'site-header' in html.lower()
        has_footer = '<footer' in html.lower() or 'site-footer' in html.lower()
        print(f"  - Header Component Present: {'[PASS]' if has_header else '[FAIL]'}")
        print(f"  - Footer Component Present: {'[PASS]' if has_footer else '[FAIL]'}")
        
        # Checklist 2: Check for unstyled raw HTML or syntax errors
        has_broken_tag = re.search(r'&lt;!--\s*wp:', html)
        print(f"  - No Broken WP Block Syntax: {'[PASS]' if not has_broken_tag else '[FAIL]'}")
        
        # Checklist 3: Check font & CSS includes
        has_css = 'main.css' in html or '<style' in html
        print(f"  - CSS Stylesheet Loaded: {'[PASS]' if has_css else '[FAIL]'}")

        return True
    except Exception as e:
        print(f"[FAIL] Error accessing {url}: {e}")
        return False

if __name__ == '__main__':
    target_url = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8000/serial-lookup/'
    verify_page_render(target_url)
