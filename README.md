# Tessel Key


[Tessel Key][tesselkey] aims to be a fully configurable [NKRO][nkro] keyboard software for the [Tessel microcontroller][tessel].

### Goals of this project
- Present Tessel as a keyboard to a USB host
    - Ideally, (optionally) present itself as multiple keyboards to bypass USB 6-key limit
- Present Tessel as a keyboard via Bluetooth module (lower priority)
- Run [express][express] + [socket.io][socket.io] on Tessel, provide Web UI to:
    - Map GPIO pin to specific NKRO row or column (hopefully 1 time configuration)
    - Map row + column combination to specific key
        - Ability to edit/save/load profiles
    - Set up macros (lower priority)
    - Layout keys physically (drag-n-drop) for visualization purposes
        - Ability to edit/save/load layouts
    - Toggle actually sending keys to host (for debugging purposes)
    - Force pin/row/column state
    - Display real-time status information:
        - Pin/row/column/key state (on, off, mode, etc.). 3 views:
            - Tessel view (shows pin state)
            - Grid view (shows row state and column state)
            - Custom layout view (shows key state (mapped row + column combination)
        - Each view is actually 2 views: graphical and textual
            - This means the custom layout view will essentially be a keylogger

[tesselkey]: http://tesselkey.com
[nkro]: http://en.wikipedia.org/wiki/Rollover_(key)#n-key_rollover
[tessel]: http://technical.io
[express]: http://expressjs.com
[socket.io]: http://socket.io
