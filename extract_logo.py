import re
import base64

with open('Your paragraph text (1).svg', 'r', encoding='utf-8') as f:
    svg_content = f.read()

match = re.search(r'data:image/png;base64,([^\"]+)', svg_content)
if match:
    b64_data = match.group(1)
    with open('app/src/main/res/drawable/ic_credilab_logo.png', 'wb') as out_f:
        out_f.write(base64.b64decode(b64_data))
    print('Successfully extracted PNG to ic_credilab_logo.png')
else:
    print('No base64 PNG found in the SVG')
