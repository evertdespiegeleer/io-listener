from pynput.keyboard import Listener as KeyboardListener
import sys

# Log all keystrokes
def on_press(key):
    try:
        print(f"down {key.char}")
        sys.stdout.flush()
    except AttributeError:
        print(f"down {key}")
        sys.stdout.flush()
    pass

def on_release(key):
    print(f"up {key}")
    sys.stdout.flush()
    pass

# This signifies that the process is running
print("ready")
sys.stdout.flush()

with KeyboardListener(on_press=on_press, on_release=on_release) as listener:
    # Start the listener
    listener.join()